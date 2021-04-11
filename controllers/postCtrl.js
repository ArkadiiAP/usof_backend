const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Category = require('../models/categoryModel')
const Like = require('../models/likeModel')
const User = require('../models/userModel')
const Post_Category = require('../models/post_categoryModel')

const postCtrl = {
    getAllPosts: async (req, res) => {
        try{
            await Post.findAndCountAll({
                limit: 4,
                offset: req.query.page * 4 - 4
            }).then(result => {
                res.status(200).json(result)
            })
        } catch (err) {
            res.status(500).json({msg: err.message})
        }
    },
    getPostById: async (req, res) => {
        try{
            const post = await Post.findOne({
                where: {id: req.params.post_id}
            })
            if(!post)
                return res.status(404).json({msg: "Post with this id does not exist"})
            return res.status(200).json({post: post})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCommentsByPostId: async (req, res) => {
        try {
            const comments = await Post.findOne({
                where: {id: req.params.post_id},
                include: [{
                    model: Comment,
                    where: {post_id: req.params.post_id}
                }]
            })
            if(!comments) return res.status(404).json({msg: "Something wrong"})
            return res.status(200).json(comments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCommentToPostById: async (req, res) => {
        try {
            const {content} = req.body
            const comment = await Comment.create({
                author: req.user.id,
                publishDate: new Date(),
                content: content,
                post_id: req.params.post_id
            })
            if(!comment) return res.status(400).json({msg: "Comment not created"})
            return res.status(200).json({msg: "Comment created"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCategoriesByPostId: async (req, res) => {
        try {
            const categories = await Post.findAll({
                where: {id: req.params.post_id},
                include: [{
                    model: Category,
                    as: "categories"
                }]
            })
            if(!categories) return res.status(400).json("Something wrong")
            return res.status(200).json(categories)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllLikesByPostId: async (req, res) => {
        try {
            const likes = await Post.findAll({
                where: {id: req.params.post_id},
                include: [{
                    model: Like,
                    where: {post_id: req.params.post_id}
                }]
            })
            if(!likes) return res.status(400).json("Likes in this post does not exist")
            return res.status(200).json({likes})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPost: async (req, res) => {
        try {
            const { title, content, categories } = req.body
            console.log(categories)
            const post = await Post.create({
                title: title,
                content: content,
                author: req.user.id,
                publishDate: new Date()
            })
            categories.map(async elem => {
                const category = await Category.findAll({
                    where: { id: elem }
                })
                post.addCategory(category)
            })

            if(!post)
                return res.status(400).json({msg: "Post not created"})
            return res.status(200).json({msg: "Post created"})
        } catch {

        }
    },
    createNewLikeByPostId: async (req, res) => {
        try {
            const { likeType } = req.body
            const check = await Like.findOne({
                where: {author: req.user.id, post_id: req.params.post_id}
            })
            if(check){
                if(check.type === 'like'){
                    if(likeType === 'like'){
                        return res.status(400).json({msg: 'You can add 1 like/dislike only'})
                    } else if (likeType === 'dislike'){
                        const post = await Post.findOne({
                            where: {id: req.params.post_id}
                        })
                        const user = await User.findOne({
                            where: {id: post.author}
                        })
                        await post.update({
                            rating: post.rating - 1
                        })
                        await user.update({
                            rating: user.rating - 1
                        })
                        await check.destroy()
                        return res.status(200).json({msg: 'Like deleted'})
                    }
                } else if(check.type === 'dislike'){
                    if(likeType === 'dislike'){
                        return res.status(400).json({msg: 'You can add 1 like/dislike only'})
                    } else if (likeType === 'like'){
                        const post = await Post.findOne({
                            where: {id: req.params.post_id}
                        })
                        const user = await User.findOne({
                            where: {id: post.author}
                        })
                        await post.update({
                            rating: post.rating + 1
                        })
                        await user.update({
                            rating: user.rating + 1
                        })
                        await check.destroy()
                        return res.status(200).json({msg: 'Dislike deleted'})
                    }
                }
            }
            const like = await Like.create({
                author: req.user.id,
                publishDate: new Date(),
                post_id: req.params.post_id,
                type: likeType
            })
            if(!like) return res.status(400).json({msg: "Like not created"})
            if(likeType === 'like') {
                const post = await Post.findOne({
                    where: {id: req.params.post_id}
                })
                const user = await User.findOne({
                    where: {id: post.author}
                })
                await post.update({
                    rating: post.rating + 1
                })
                await user.update({
                    rating: user.rating + 1
                })
                return res.status(200).json({msg: "Like created"})
            }
            if(likeType === 'dislike') {
                const post = await Post.findOne({
                    where: {id: req.params.post_id}
                })
                const user = await User.findOne({
                    where: {id: post.author}
                })
                await post.update({
                    rating: post.rating - 1
                })
                await user.update({
                    rating: user.rating - 1
                })
                return res.status(200).json({msg: "Dislike created"})
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updatePostById: async (req, res) => {
        const { title, content, categories } = req.body
        const post = await Post.findOne({
            where: {id: req.params.post_id}
        })
        if(post.author === req.user.id){
            await post.update({
                title: title ? title : post.title,
                content: content ? content : post.content,
            })
        }
        if(post.author !== req.user.id) return res.status(401).json({msg: "Only the author can update the post"})
        if(!post) return res.status(400).json({msg: "Post cant be update"})
        return res.status(200).json({msg: "Post updated"})
    },
    deletePostById: async (req, res) => {
        try {
            const post = await Post.findOne({
                where: {id: req.params.post_id}
            })
            if(!post)
                return res.status(400).json({msg: "Post with this id not found"})
            if(post.author === req.user.id || req.user.role === "admin"){
                await Post.destroy({
                    where: {id: req.params.post_id}
                })
                return res.status(200).json({msg: "Post deleted"})
            } else
                return res.status(401).json({msg: "Only the author or admin can delete the post"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteLikeByPostId: async (req, res) => {
        try {
            const post = await Post.findOne({
                where: {id: req.params.post_id}
            })
            if(!post)
                return res.status(400).json({msg: "Post with this id not found"})
            const like = await Like.findOne({
                where: {
                    post_id: req.params.post_id,
                    author: req.user.id
                }
            })
            if(!like)
                return res.status(400).json({msg: "You did not like this post"})
            if(like.type === 'like'){
                await post.update({
                    rating: post.rating - 1
                })
            }
            if(like.type === 'dislike'){
                await post.update({
                    rating: post.rating + 1
                })
            }
            await like.destroy()
            return res.status(200).json({msg: "like deleted"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = postCtrl
