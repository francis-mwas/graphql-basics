const Subscription = {
  comment: {
    subscribe(parent, args, ctx, info) {
      const { postId } = args;
      const { db, pubsub } = ctx;
      const post = db.posts.find(post => post.id === postId);

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },

  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    }
  }
};

export default Subscription;
