export function mockAPIResponse<TData>(data: TData, ms: number) {
    return new Promise<TData>((resolve) => {
        setTimeout(() => resolve(data), ms);
    });
}
