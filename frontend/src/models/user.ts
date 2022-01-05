class User {
  id: string;
  image: string;
  name: string;
  placeCount: number;

  constructor(name: string, image: string, placeCount: number) {
    this.id = Math.random().toString();
    this.image = image;
    this.name = name;
    this.placeCount = placeCount;
  }
}

export default User;
