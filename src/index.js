import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscriptions";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

// creating a new instance for our Subscription
const pubsub = new PubSub();

// initialize graphql server
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log("Graphql server is up and running!!");
});
