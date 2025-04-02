const Message = require("../models/Message")

exports.createMessage = async (req, res) => {
  try {
    const { content, receiver } = req.body
    const sender = req.user._id

    // Utiliser le destinataire du corps de la requête s'il est fourni, sinon utiliser le coach de l'utilisateur
    const messageReceiver = receiver || req.user.coach

    if (!messageReceiver) {
      return res.status(400).json({
        success: false,
        error: "Aucun destinataire spécifié et pas de coach assigné à cet utilisateur",
      })
    }

    const message = new Message({
      sender,
      receiver: messageReceiver,
      content,
      date: new Date(),
    })

    await message.save()

    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (error) {
    console.error("Erreur lors de la création du message:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.getConversation = async (req, res) => {
  try {
    const userId = req.params.userId

    // Vérifier si l'ID est valide
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "ID utilisateur requis",
      })
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ date: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

