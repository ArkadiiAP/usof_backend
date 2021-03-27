const Comment = require('../models/commentModel')
const Like = require('../models/likeModel')

const commentCtrl = {
    getCommentById: async (req, res) => {
        try {
            const comment = await Comment.findOne({
                where: {id: req.params.comment_id}
            })
            if(!comment)
                return res.status(404).json({msg: "Comment with this id not found"})
            return res.status(200).json(comment)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllLikesByCommentId: async (req, res) => {
        try {
            const likes = await Comment.findAll({
                where: {id: req.params.comment_id},
                include: [{
                    model: Like,
                    where: {comment_id: req.params.comment_id}
                }]
            })
            if(!likes)
                return res.status(404).json({msg: "No Likes under this comment"})
            return res.status(200).json(likes)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createNewLikeByCommentId: async (req, res) => {
        try {
            const { likeType } = req.body
            const comment = await Comment.findOne({
                where: {id: req.params.comment_id}
            })
            if(!comment)
                return res.status(404).json({msg: "Comment with this id does not exist"})
            const like = await Like.findOne({
                where: {author: req.user.id, comment_id: req.params.comment_id}
            })
            if (!like) {
                await Like.create({
                    author: req.user.id,
                    publishDate: new Date(),
                    comment_id: req.params.comment_id,
                    type: likeType
                })
                return res.status(200).json({msg: "Like created"})
            } else
                return res.status(400).json({msg: "You already liked this comment"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCommentById: async (req, res) => {
        try {
            const { content } = req.body
            const comment = await Comment.findOne({
                where: {id: req.params.comment_id}
            })
            if(!comment)
                return res.status(404).json({msg: "Comment with this id does not exist"})
            if (comment.author === req.user.id) {
                await comment.update({
                    content: content,
                    publishDate: new Date(),
                })
                return res.status(200).json({msg: "Comment updated"})
            } else
                return res.status(400).json({msg: "You are not author of this comment"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCommentById: async (req, res) => {
        try {
            const comment = await Comment.findOne({
                where: {id: req.params.comment_id}
            })
            if(!comment)
                return res.status(404).json({msg: "Comment with this id does not exist"})
            if(comment.author === req.user.id || req.user.role === "admin") {
                comment.destroy()
                return res.status(200).json({msg: "Comment deleted"})
            } else
                return res.status(400).json({msg: "Only author or admin can delete comment"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteLikeByCommentId: async (req, res) => {
        try {
            const comment = await Comment.findOne({
                where: {id: req.params.comment_id}
            })
            if(!comment)
                return res.status(404).json({msg: "Comment with this id does not exist"})
            const like = await Like.findOne({
                where: {comment_id: comment.id, author: req.user.id}
            })
            if(!like)
                return res.status(404).json({msg: "No like under this comment"})
            await like.destroy()
            return res.status(200).json({msg: "Like deleted"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = commentCtrl