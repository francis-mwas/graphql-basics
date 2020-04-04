import uuidV4 from "uuid/v4";

const Mutation = {
  // create user
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email already regsitered");
    }

    const user = {
      id: uuidV4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },

  // delete user
  deleteUser(parents, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      return new Error("User not found");
    }

    const deletedUser = db.users.splice(userIndex, 1);

    // delete posts associated with user to be deleted
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUser[0];
  },

  // update user
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User with this id does not exist");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email already taken");
      }
      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  // create post
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      return new Error("User not found");
    }

    const post = {
      id: uuidV4(),
      ...args.data,
    };

    db.posts.push(post);

    if (!args.data.published) {
      throw new Error("Post not found");
    }

    pubsub.publish("post", {
      post: {
        mutation: "CREATED",
        data: post,
      },
    });

    return post;
  },

  // delete a post
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      return new Error("Post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);

    // delete comments associated with deleted post
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },

  // update post
  upadtePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);

    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        //deleted

        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else {
        if (!originalPost.published && post.published) {
          //created
          pubsub.publish("post", {
            post: {
              mutation: "CREATED",
              data: post,
            },
          });
        }
      }
    } else if (post.published) {
      //updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComments(parent, args, { db, pubsub }, info) {
    const authorExists = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!authorExists) {
      return new Error("Author not found");
    }

    if (!postExist) {
      return new Error("Post not yet published");
    }

    const comment = {
      id: uuidV4(),
      text: args.data.text,
      post: args.data.post,
      author: args.data.author,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  // upadate comment
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("The comment does not exist");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comments ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },

  // delete comments
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },
};

export default Mutation;
