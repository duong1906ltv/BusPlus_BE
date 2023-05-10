import Location from "../models/Location.js";

export const locationChangeStream = () => {
	const changeStream = Location.watch();

	changeStream.on("change", (change) => {
		if (change.operationType === "update") {
			const { busId, lat, lng } =
				change.updateDescription.updatedFields;
			io.emit("locationChange", { busId, lat, lng });
		}
	});

	changeStream.on("error", (error) => {
		console.log(`Encountered an error: ${error}`);
	});
};
