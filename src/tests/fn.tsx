import fetch from "isomorphic-fetch";

export async function getData({ pageParam = 1 }) {
    const skip = pageParam * 10;
    const res = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${skip}&select=title,price`
    );
    const data: any = await res.json();
    // // return res;
    console.log({ data });
    // const res = "10";
    return data.products;
}
