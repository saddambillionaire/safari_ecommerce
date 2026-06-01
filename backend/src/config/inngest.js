import { Inngest } from 'inngest';
import connectDB from "./db.js";
import { User } from '../models/user.model.js';

export const inngestClient = new Inngest({
  id: "safari_ecommerce",
});

const syncUser = inngestClient.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDB();

    console.log("connected to database");

  console.log(event.data);


    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
    } = event.data;

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      imageUrl: image_url || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      addresses: [],
      wishlist: [],
    };

    await User.create(user);

    console.log("User synced successfully");
  }
);

const deleteUserFromDB = inngestClient.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];