// users
const users = [
  {
    id: "1",
    name: "Francis mwangi",
    email: "info@mwas.co.ke",
    age: 28
  },
  {
    id: "2",
    name: "John doe",
    email: "info@doe.co.ke"
  },
  {
    id: "3",
    name: "Foo bar",
    email: "info@foo.co.ke"
  },
  {
    id: "4",
    name: "Carl max",
    email: "info@max.co.ke",
    age: 29
  }
];

// posts
const posts = [
  {
    id: "1",
    title: "Resolvers in GraphQl",
    body: "This is my firts post about the Graphql resolvers",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Creating a blog GrapQl api",
    body: "",
    published: false,
    author: "2"
  },
  {
    id: "3",
    title: "Introduction to array helpers in javascript",
    body:
      "Array helpers are ver important concepts in javascript, which every dev should know.",
    published: true,
    author: "2"
  },
  {
    id: "4",
    title: "Graphql subscriptions",
    body: "Get realtime subscriptions.",
    published: true,
    author: "2"
  }
];

//comments
const comments = [
  {
    id: "1",
    text: "Hello, this is exactly what i have been looking for, many thanks!!",
    author: "3",
    post: "1"
  },
  {
    id: "2",
    text: "Thanks for the post",
    author: "2",
    post: "2"
  },
  {
    id: "3",
    text: "GraphQl is awesome",
    author: "1",
    post: "2"
  },
  {
    id: "4",
    text: "Not working for me",
    author: "2",
    post: "3"
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
