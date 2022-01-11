class Place {
  id: string;

  title: string;
  description: string;
  address: string;
  creatorId: string;

  constructor(
    id: string,
    public imageURL: string,
    title: string,
    description: string,
    address: string,
    creatorId: string,
    public coordinates: {
      lat: number;
      lng: number;
    }
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.address = address;
    this.creatorId = creatorId;
  }
}

export default Place;
