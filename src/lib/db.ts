import mongoose from "mongoose";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DNS_SERVERS = process.env.MONGODB_DNS_SERVERS;

if (MONGODB_DNS_SERVERS) {
  dns.setServers(MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
}

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;