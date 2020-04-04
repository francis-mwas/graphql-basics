const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    db.posts.filter(post => {
      return post.title.toLowerCase().includes(args.query.toLowerCase());
    });
    return db.posts.filter(post => {
      return post.body.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  comments(parent, args, { db }, info) {
    return db.comments;
  },

  greetings(parent, args, ctx, info) {
    if (args.name) {
      return `Hello ${args.name}`;
    }
  },

  grades(parent, args, ctx, info) {
    return [29, 20, 10, 33, 44];
  },

  add(parent, args, ctx, info) {
    if (args.numbers.length === 0) {
      return 0;
    } else {
      return args.numbers.reduce((acc, cur) => {
        return acc + cur;
      }, 0);
    }
  },

  me() {
    return {
      id: "2cabc13338",
      name: "mwas",
      email: "mwas@gmail.com",
      age: 23
    };
  },

  post() {
    return {
      id: "2cabc13338",
      title: "Introduction to Graphql",
      body: "This is the first series of our course on graphql",
      published: false
    };
  }
};

export default Query;
