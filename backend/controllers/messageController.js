const Message = require("../models/Message")
const User = require("../models/User")
const Coach = require("../models/Coach")
const mongoose = require("mongoose")

// @desc    Envoyer un message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un destinataire et un contenu",
      })
    }

    // Déterminer le modèle du destinataire (User ou Coach)
    let receiver
    let receiverModel

    // Vérifier d'abord si c'est un utilisateur
    receiver = await User.findById(receiverId)
    if (receiver) {
      receiverModel = "User"
    } else {
      // Sinon, vérifier si c'est un coach
      receiver = await Coach.findById(receiverId)
      if (receiver) {
        receiverModel = "Coach"
      }
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Destinataire non trouvé",
      })
    }

    // Déterminer le modèle de l'expéditeur
    const senderModel = req.user.role === "coach" ? "Coach" : "User"

    // Créer le message
    const message = await Message.create({
      sender: req.user._id,
      senderModel,
      receiver: receiverId,
      receiverModel,
      content,
      read: false,
    })

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      data: message,
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message",
      error: error.message,
    })
  }
}

// @desc    Obtenir tous les messages d'un utilisateur
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    // Déterminer le modèle de l'utilisateur
    const userModel = req.user.role === "coach" ? "Coach" : "User"

    // Obtenir les messages envoyés et reçus
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, senderModel: userModel },
        { receiver: req.user._id, receiverModel: userModel },
      ],
    }).sort({ createdAt: -1 })

    // Enrichir les messages avec les informations des expéditeurs et destinataires
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageObj = message.toObject()

        // Récupérer les informations de l'expéditeur
        if (message.senderModel === "User") {
          const sender = await User.findById(message.sender).select("name email")
          if (sender) {
            messageObj.senderInfo = { name: sender.name, email: sender.email }
          }
        } else {
          const sender = await Coach.findById(message.sender).select("name email")
          if (sender) {
            messageObj.senderInfo = { name: sender.name, email: sender.email }
          }
        }

        // Récupérer les informations du destinataire
        if (message.receiverModel === "User") {
          const receiver = await User.findById(message.receiver).select("name email")
          if (receiver) {
            messageObj.receiverInfo = { name: receiver.name, email: receiver.email }
          }
        } else {
          const receiver = await Coach.findById(message.receiver).select("name email")
          if (receiver) {
            messageObj.receiverInfo = { name: receiver.name, email: receiver.email }
          }
        }

        return messageObj
      }),
    )

    res.status(200).json({
      success: true,
      count: enrichedMessages.length,
      data: enrichedMessages,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des messages",
      error: error.message,
    })
  }
}

// @desc    Obtenir les conversations d'un utilisateur
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    // Déterminer le modèle de l'utilisateur
    const userModel = req.user.role === "coach" ? "Coach" : "User"

    // Obtenir tous les messages
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, senderModel: userModel },
        { receiver: req.user._id, receiverModel: userModel },
      ],
    }).sort({ createdAt: -1 })

    // Créer un tableau de conversations
    const conversations = []
    const conversationMap = new Map()

    // Traiter chaque message pour créer les conversations
    for (const message of messages) {
      let otherPersonId, otherPersonModel

      // Déterminer l'autre personne dans la conversation
      if (message.sender.toString() === req.user._id.toString() && message.senderModel === userModel) {
        otherPersonId = message.receiver
        otherPersonModel = message.receiverModel
      } else {
        otherPersonId = message.sender
        otherPersonModel = message.senderModel
      }

      const conversationKey = `${otherPersonId}-${otherPersonModel}`

      // Si cette conversation n'existe pas encore, la créer
      if (!conversationMap.has(conversationKey)) {
        // Récupérer les informations de l'autre personne
        let otherPerson
        if (otherPersonModel === "User") {
          otherPerson = await User.findById(otherPersonId).select("name email")
        } else {
          otherPerson = await Coach.findById(otherPersonId).select("name email")
        }

        if (otherPerson) {
          conversationMap.set(conversationKey, {
            otherPerson: {
              id: otherPersonId,
              model: otherPersonModel,
              name: otherPerson.name,
              email: otherPerson.email,
            },
            lastMessage: message,
            unreadCount: message.receiver.toString() === req.user._id.toString() && !message.read ? 1 : 0,
          })
        }
      } else {
        // Mettre à jour le compteur de messages non lus
        const conversation = conversationMap.get(conversationKey)
        if (message.receiver.toString() === req.user._id.toString() && !message.read) {
          conversation.unreadCount += 1
        }
      }
    }

    // Convertir la Map en tableau
    conversationMap.forEach((conversation) => {
      conversations.push(conversation)
    })

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des conversations",
      error: error.message,
    })
  }
}

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params
    const { model } = req.query // Optionnel: "User" ou "Coach"

    // Déterminer le modèle de l'utilisateur actuel
    const currentUserModel = req.user.role === "coach" ? "Coach" : "User"

    // Déterminer le modèle de l'autre utilisateur
    const otherUserModel = model || "User"

    // Vérifier si l'autre utilisateur existe
    let otherUser
    if (otherUserModel === "User") {
      otherUser = await User.findById(userId)
    } else {
      otherUser = await Coach.findById(userId)
    }

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Obtenir les messages de la conversation
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, senderModel: currentUserModel, receiver: userId, receiverModel: otherUserModel },
        { sender: userId, senderModel: otherUserModel, receiver: req.user._id, receiverModel: currentUserModel },
      ],
    }).sort({ createdAt: 1 })

    // Enrichir les messages avec les informations des expéditeurs et destinataires
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageObj = message.toObject()

        // Récupérer les informations de l'expéditeur
        if (message.senderModel === "User") {
          const sender = await User.findById(message.sender).select("name email")
          if (sender) {
            messageObj.senderInfo = { name: sender.name, email: sender.email }
          }
        } else {
          const sender = await Coach.findById(message.sender).select("name email")
          if (sender) {
            messageObj.senderInfo = { name: sender.name, email: sender.email }
          }
        }

        // Récupérer les informations du destinataire
        if (message.receiverModel === "User") {
          const receiver = await User.findById(message.receiver).select("name email")
          if (receiver) {
            messageObj.receiverInfo = { name: receiver.name, email: receiver.email }
          }
        } else {
          const receiver = await Coach.findById(message.receiver).select("name email")
          if (receiver) {
            messageObj.receiverInfo = { name: receiver.name, email: receiver.email }
          }
        }

        return messageObj
      }),
    )

    // Marquer les messages non lus comme lus
    await Message.updateMany(
      {
        sender: userId,
        senderModel: otherUserModel,
        receiver: req.user._id,
        receiverModel: currentUserModel,
        read: false,
      },
      { read: true },
    )

    res.status(200).json({
      success: true,
      count: enrichedMessages.length,
      data: enrichedMessages,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la conversation",
      error: error.message,
    })
  }
}

// @desc    Marquer un message comme lu
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé",
      })
    }

    // Vérifier si l'utilisateur est le destinataire
    const userModel = req.user.role === "coach" ? "Coach" : "User"
    if (message.receiver.toString() !== req.user._id.toString() || message.receiverModel !== userModel) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à marquer ce message comme lu",
      })
    }

    // Marquer comme lu
    message.read = true
    await message.save()

    res.status(200).json({
      success: true,
      message: "Message marqué comme lu",
      data: message,
    })
  } catch (error) {
    console.error("Erreur lors du marquage du message:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors du marquage du message",
      error: error.message,
    })
  }
}
