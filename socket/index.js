import Location from "../models/Location.js";
import Bus from "../models/Bus.js"

export const locationChangeStream = (socket) => {
	// Lắng nghe sự kiện cập nhật từ bảng "Location"
	const locationChangeStream = Location.watch();

	// Khi có sự thay đổi trong bảng "Location"
	locationChangeStream.on('change', (change) => {
		if (change.operationType === 'update') {
		const updatedLocation = change.fullDocument;

		// Cập nhật vị trí của biểu tượng xe buýt trên bản đồ
		socket.emit('updateBusLocation', updatedLocation);
		}
	});

};

export const busChangeStream = (socket) => {
	  // Lắng nghe sự kiện cập nhật từ bảng "Bus"
	  const busChangeStream = Bus.watch();

	  // Khi có sự thay đổi trong bảng "Bus"
	  busChangeStream.on('change', (change) => {
		if (change.operationType === 'update') {
		  const updatedBus = change.fullDocument;
	
		  // Kiểm tra trạng thái của Bus
		  if (updatedBus.activeStatus === true) {
			// Gửi thông báo tới client để tạo biểu tượng xe buýt trên bản đồ
			socket.emit('createBusIcon',updatedBus );
		  }
		}
	  });
}
