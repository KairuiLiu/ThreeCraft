declare interface ClientDataType<T, D> {
	type: T;
	data: D;
	message?: string;
}

declare interface ServerDataType<T, D> {
	type: T;
	data: D;
	message?: string;
}
