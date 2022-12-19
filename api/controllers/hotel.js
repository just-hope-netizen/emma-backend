import Hotel from '../models/hotel.js';
import cloudinary from '../utils/clodinary.js';

export const createHotel = async (req, res) => {

  const { name, area, address, image } = req.body;

  // return
  //upload image
  const uploadedImage = await cloudinary.uploader.upload(image,
    { folder: 'emma-project' },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      }

    });
  try {
    const newHotel = new Hotel({
      img: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      },

      name, address, area
    });

    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }

};

export const createRoom = async (req, res) => {

  const { id, title, price, image, amountRoom } = req.body;

  //upload image
  const uploadedImage = await cloudinary.uploader.upload(image,
    { folder: 'emma-project' },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      }

    });
  try {


    const updatedProduct = await Hotel.findByIdAndUpdate(
      id,
      {
        $push: {
          "rooms": {
            title, price, amountRoom, img: {
              public_id: uploadedImage.public_id,
              url: uploadedImage.secure_url
            },
          }
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }

};

export const updateHotel = async (req, res) => {
  const { image, price, category, title } = req.body;

  try {
    //delete former img from cloudinary
    const foundProduct = await Product.findById(req.params.id);
    const formerImage = foundProduct.image.public_id;
    cloudinary.uploader.destroy(formerImage)

    //upload new image
    const uploadedImage = await cloudinary.v2.uploader.upload(image,
      { folder: 'emma-project' },
      (error, result) => {
        if (error) {
          res.status(500).json(error);
        }

      });
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
          },
          title: title,
          price: price,
          categories: category
        }
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  };
}


export const deleteProduct = async (req, res) => {
  try {
    //delete  img from cloudinary
    const foundProduct = await Product.findById(req.params.id);
    const formerImage = foundProduct.image.public_id;
    cloudinary.v2.uploader.destroy(formerImage)

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
}

export const getHotels = async (req, res) => {
  const query = req.query.area;
  try {

    const hotels = await Hotel.find({ area: { $regex: query, $options: 'i' } })

    res.status(200).json(hotels);

  } catch (err) {
    res.status(500).json(err);
  }
}

export const getHotel = async (req, res) => {
  const query = req.query.hotel;

  try {
    const hotels = await Hotel.find({ name: { $regex: query, $options: 'i' } })


    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
}
export const allHotels = async (req, res) => {

  try {
    const hotels = await Hotel.find({})


    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
}