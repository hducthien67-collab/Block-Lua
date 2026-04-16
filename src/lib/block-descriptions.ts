export const getBlockDescription = (block: any, lang: string) => {
  const type = block.type.toLowerCase();
  const name = block.name;
  
  // Events
  if (type.includes('event')) {
    if (type.includes('touched')) {
      return lang === 'vi'
        ? `Sự kiện này kích hoạt khi một đối tượng khác chạm vào đối tượng này. Nó trả về đối tượng đã chạm vào (OtherPart). Rất hữu ích để tạo bẫy, cửa tự động hoặc vùng hồi máu.`
        : `This event triggers when another object touches this object. It returns the object that touched it (OtherPart). Useful for creating traps, automatic doors, or healing zones.`;
    }
    if (type.includes('click')) {
      return lang === 'vi'
        ? `Sự kiện này kích hoạt khi người chơi click chuột vào đối tượng (phải có ClickDetector). Cho phép bạn tạo các nút bấm, công tắc hoặc vật phẩm có thể tương tác.`
        : `This event triggers when a player clicks on the object (requires a ClickDetector). Allows you to create buttons, switches, or interactive items.`;
    }
    return lang === 'vi' 
      ? `Sự kiện "${name}" sẽ tự động chạy đoạn mã bên trong khi điều kiện tương ứng xảy ra trong trò chơi. Đây là điểm bắt đầu của hầu hết các kịch bản.`
      : `The "${name}" event will automatically run the code inside when the corresponding condition occurs in the game. This is the starting point for most scripts.`;
  }
  
  // Properties (Set/Get)
  if (type.includes('set_')) {
    const prop = name.replace('set ', '').replace('đặt ', '');
    return lang === 'vi'
      ? `Khối lệnh này cho phép bạn thay đổi giá trị của thuộc tính "${prop}". Ví dụ: đổi màu sắc, độ trong suốt, hoặc vị trí của một khối Part.`
      : `This block allows you to change the value of the "${prop}" property. For example: changing the color, transparency, or position of a Part.`;
  }
  if (type.includes('get_')) {
    const prop = name.replace('get ', '').replace('lấy ', '');
    return lang === 'vi'
      ? `Khối lệnh này đọc giá trị hiện tại của thuộc tính "${prop}" để bạn có thể sử dụng nó trong các phép tính hoặc điều kiện khác.`
      : `This block reads the current value of the "${prop}" property so you can use it in other calculations or conditions.`;
  }
  
  // Logic
  if (type === 'lua_if') {
    return lang === 'vi'
      ? `Cấu trúc điều kiện cơ bản nhất. Nếu [điều kiện] là đúng (true), thì các lệnh bên trong sẽ được thực hiện. Nếu sai, chúng sẽ bị bỏ qua.`
      : `The most basic conditional structure. If the [condition] is true, the blocks inside will be executed. If false, they will be skipped.`;
  }
  
  // Instance creation
  if (type.includes('instance_new')) {
    return lang === 'vi'
      ? `Tạo ra một đối tượng mới hoàn toàn (như Part, Script, Sound) trong trò chơi. Bạn cần đặt Parent cho nó để nó xuất hiện trong thế giới.`
      : `Creates a brand new object (like a Part, Script, Sound) in the game. You need to set its Parent for it to appear in the world.`;
  }

  // Default fallback
  return lang === 'vi' 
    ? `Khối lệnh "${name}" thuộc nhóm ${block.category}. Nó cung cấp các chức năng chuyên sâu để điều khiển ${name.toLowerCase()} trong môi trường Roblox.`
    : `The "${name}" block belongs to the ${block.category} category. It provides specialized functions to control ${name.toLowerCase()} within the Roblox environment.`;
};
