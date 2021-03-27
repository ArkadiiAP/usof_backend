# usof_backend
create an API for a future question and answer service for professional and enthusiast programmers

### Authentication module:
**bold – POST - /api/auth/register bold** - registration of a new user, required parameters are [login, password, password confirmation, email]
**bold - POST - /api/auth/<activation_token> bold** - confirm email and create user.
**bold – POST - /api/auth/login bold** - log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in
**bold – POST - /api/auth/logout bold** - log out authorized user
**bold – POST - /api/auth/password-reset bold** - send a reset link to user email, requiredparameter is [email]
**bold – POST - /api/auth/password-reset/<confirm_token> bold** - confirm new password with atoken from email, required parameter is a [new password]
### User module:
**bold – GET - /api/users bold** - get all users
**bold – GET - /api/users/<user_id> bold** - get specified user data
**bold – POST - /api/users bold** - create a new user, required parameters are [login, password, password confirmation, email, role]. This feature must be accessible only for admins
**bold – POST - /api/users/avatar bold** - let an authorized user upload his/her avatar. Theuser will be designated by his/her access token
**blod – PATCH - /api/users/<user_id> bold** - update user data
**bold – DELETE - /api/users/<user_id> bold** - delete user
### Post module:
**bold – GET - /api/posts bold** - get all posts. This endpoint doesn't require any role, it is public. Cancel Changes
**bold – GET - /api/posts/<post_id> bold** - get specified post data. Endpoint is public
**bold – GET - /api/posts/<post_id>/comments bold** - get all comments for the specified post. Endpoint is public
**bold – POST - /api/posts/<post_id>/comments bold** - create a new comment, required parameter is [content]
**bold – GET - /api/posts/<post_id>/categories bold** - get all categories associated with the specified post
**bold – GET - /api/posts/<post_id>/like bold** - get all likes under the specified post
**bold – POST - /api/posts/ bold** - create a new post, required parameters are [title, content,categories]
**bold – POST - /api/posts/<post_id>/like bold** - create a new like under a post
**bold – PATCH - /api/posts/<post_id> bold** - update the specified post (its title, body or category). It's accessible only for the creator of the post
**bold – DELETE - /api/posts/<post_id> bold** - delete a post
**bold – DELETE - /api/posts/<post_id>/like bold** - delete a like under a post
### Categories module:
**bold – GET - /api/categories bold** - get all categories
**bold – GET - /api/categories/<category_id> bold** - get specified category data
**bold – GET - /api/categories/<category_id>/posts bold** - get all posts associated with the specified category
**bold – POST - /api/categories bold** - create a new category, required parameter is [title]
**bold – PATCH - /api/categories/<category_id> bold** - update specified category data
**bold – DELETE - /api/categories/<category_id> bold** - delete a category
### Comments module:
**bold – GET - /api/comments/<comment_id> bold** - get specified comment data
**bold – GET - /api/comments/<comment_id>/like bold** - get all likes under the specified comment
**bold – POST - /api/comments/<comment_id>/like bold** - create a new like under a comment
**bold – PATCH - /api/comments/<comment_id> bold** - update specified comment data
**bold – DELETE - /api/comments/<comment_id> bold** - delete a comment
**bold – DELETE - /api/comments/<comment_id>/like bold** - delete a like under a comment
