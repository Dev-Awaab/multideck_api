// import mongoose from 'mongoose'

// const connectDB = async () => {
//      try {
//          await mongoose.connect('mongodb://localhost/Multi_Api')

//         console.log(`Mongodb Connected `.bgCyan.bold)
//      } catch (error) {
//          console.log(`Error: ${error.message}`)
//          process.exit(1)
//      }
// }

// export default connectDB;

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB