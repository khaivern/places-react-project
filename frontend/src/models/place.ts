class Place {
  id: string;
  image: string;
  title: string;
  description: string;
  address: string;
  creatorId: string;
  location: {
    lat: number;
    lng: number;
  };
  constructor(
    image: string,
    title: string,
    description: string,
    address: string,
    creatorId: string,
    location: {
      lat: number;
      lng: number;
    }
  ) {
    this.id = Math.random().toString();
    this.image = image;
    this.title = title;
    this.description = description;
    this.address = address;
    this.creatorId = creatorId;
    this.location = location;
  }
}

export default Place;
