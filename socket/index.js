import Location from "../models/Location.js";

export const locationChangeStream = () => {
	const changeStream = Location.watch();

	changeStream.on("change", (change) => {
		if (change.operationType === "update") {
			const { busId, latitude, longitude } =
				change.updateDescription.updatedFields;
			io.emit("locationChange", { busId, latitude, longitude });
		}
	});

	changeStream.on("error", (error) => {
		console.log(`Encountered an error: ${error}`);
	});
};
