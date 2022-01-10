class User {
  constructor(
    public name: string,
    public imageURL: string,
    public placeCount: number,
    public id: string,
    public places?: string[] | Object[],
    public email?: string
  ) {}
}

export default User;
