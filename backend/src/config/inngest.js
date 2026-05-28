// import { Inngest } from 'inngest';
// import connectDB from "./db.js";
// import{User} from '../models/user.model.js';

// export const inngestClient = new Inngest({id:'safari_ecommerce'});

// const syncUser = inngestClient.createFunction(
//   { id: 'sync-user' },
//   { event: 'clerk/user.created' },

//   async ({ event }) => {
//     try {
//       await connectDB();

//       const {
//         id,
//         email_addresses,
//         image_url,
//         first_name,
//         last_name,
//       } = event.data;

//       const user = {
//         clerkId: id,
//         email: email_addresses?.[0]?.email_address || '',
//         imageUrl: image_url || '',
//         name:
//           `${first_name || ''} ${last_name || ''}`.trim() || 'User',
//         addresses: [],
//         wishlist: [],
//       };

//       await User.create(user);

//       console.log('User synced successfully');
//     } catch (error) {
//       console.error('Error syncing user:', error);
//       throw error;
//     }
//   }
// );

// const deleteUserFromDB = inngestClient.createFunction(
//     {id: 'delete-user-from-db'},
//     {event: 'clerk/user.deleted'},
//     async ({event}) => {
//         await connectDB();
//         const {id} = event.data;
//         await User.deleteOne({clerkId: id});
//     }
// );

// export const functions = [syncUser, deleteUserFromDB];

// import { Inngest } from 'inngest';
// import connectDB from "./db.js";
// import { User } from '../models/user.model.js';

// export const inngestClient = new Inngest({
//   id: 'safari_ecommerce'
// });

// const syncUser = inngestClient.createFunction(
//   {
//     id: 'sync-user',
//     triggers: [
//       {
//         event: 'clerk/user.created',
//       },
//     ],
//   },
//   async ({ event }) => {
//     try {
//       await connectDB();

//       const {
//         id,
//         email_addresses,
//         image_url,
//         first_name,
//         last_name,
//       } = event.data;

//       const user = {
//         clerkId: id,
//         email: email_addresses?.[0]?.email_address || '',
//         imageUrl: image_url || '',
//         name:
//           `${first_name || ''} ${last_name || ''}`.trim() || 'User',
//         addresses: [],
//         wishlist: [],
//       };

//       await User.create(user);

//       console.log('User synced successfully');
//     } catch (error) {
//       console.error('Error syncing user:', error);
//       throw error;
//     }
//   }
// );



// const deleteUserFromDB = inngestClient.createFunction(
//   {
//     id: 'delete-user-from-db',
//     triggers: [
//       {
//         event: 'clerk/user.deleted',
//       },
//     ],
//   },
//   async ({ event }) => {
//     await connectDB();

//     const { id } = event.data;

//     await User.deleteOne({ clerkId: id });
//   }
// );

// export const functions = [syncUser, deleteUserFromDB];

import { Inngest } from 'inngest';
import connectDB from './db.js';
import { User } from '../models/user.model.js';

export const inngestClient = new Inngest({
  id: 'safari_ecommerce',
});

const syncUser = inngestClient.createFunction(
  {
    id: 'sync-user',
    trigger: {
      event: 'clerk/user.created',
    },
  },

  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
      } = event.data;

      const existingUser = await User.findOne({ clerkId: id });

      if (existingUser) {
        console.log('User already exists');
        return;
      }

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || '',
        imageUrl: image_url || '',
        name:
          `${first_name || ''} ${last_name || ''}`.trim() || 'User',
        addresses: [],
        wishlist: [],
      };

      await User.create(user);

      console.log('User synced successfully');
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  }
);

const deleteUserFromDB = inngestClient.createFunction(
  {
    id: 'delete-user-from-db',
    trigger: {
      event: 'clerk/user.deleted',
    },
  },

  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;

      await User.deleteOne({ clerkId: id });

      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];