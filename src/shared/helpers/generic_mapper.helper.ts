export class GenericMapper {
  public map<T, U>(entity: T, dtoType: new () => U): U {
    // Create a new instance of the DTO type.
    const dto = new dtoType();
    // Copy all properties from the entity to the DTO.
    for (const key of Object.keys(dto)) {
      // If the entity has the property, copy it to the DTO.
      if (entity.hasOwnProperty(key)) {
        dto[key] = entity[key];
      }
    }
    // Return the DTO.
    return dto;
  }
}
