import React from "react";
import nock from "nock";
import axios from "axios";

import res from "./testData.json";

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { getData } from "./fn";

export function useCustomHook() {
    return useQuery({ queryKey: ["customHook"], queryFn: () => "Hello" });
}

const data = JSON.stringify(res.products);
console.log(res);
console.log(data);
const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useCustomHook(), { wrapper });

test("test test", async () => {
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

// function useInfiniteQueryCustomHook(){
//     return useInfiniteQuery({queryKey:
//     ['infinite'],
//         queryFn: ({ pageParam = 1 }) => fetchPage(pageParam),
//         ...options,
//         getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
//         getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
//       })
// }

const axiosClient = axios.create({
    baseURL: "http://example.com",
    headers: {
        "content-type": "application/json",
    },
});

// export async function getData({ pageParam = 1 }) {
//     const skip = pageParam * 10;
//     const res = await fetch(
//         `https://dummyjson.com/products?limit=10&skip=${skip}&select=title,price`
//     );
//     const data = await res.json();
//     // // return res;
//     console.log({ data });
//     // const res = "10";
//     return data.products;
// }

export const useUsersQuery = () => {
    const query = useInfiniteQuery(["users"], getData, {
        getNextPageParam: (lastPage: any) => lastPage.next,
    });

    return query;
};

// function generateMockedResponse(page) {
//     return {
//         page: page,
//         items: [1, 2],
//     };
// }

test("infinite query test", async () => {
    // 4- Create nock request interceptor and return mocked data
    nock("https://dummyjson.com")
        // .persist()
        .get("/products?limit=10&skip=10&select=title,price")
        .reply(200, res);

    const { result } = renderHook(
        // () =>
        //     useInfiniteQuery({
        //         queryKey: ["items"],
        //         queryFn: async ({ pageParam = 1 }) => {
        //             // const skip = pageParam * 10;
        //             // const res = fetch(
        //             //     `https://dummyjson.com/products?limit=10&skip=${skip}&select=title,price`
        //             // );
        //             // return res;
        //             return "ten";
        //         },
        //     }),
        useUsersQuery,
        // () => {
        //     return "ten";
        // },

        { wrapper }
    );

    // await waitFor(() => {
    //     return result.current;
    // });

    await waitFor(() =>
        expect(result?.current?.data?.pages).toEqual([res.products])
    );
    // const data = (await result.current).data?.pages;

    // await expect(data).resolves.toEqual("ten");

    // await waitFor(() => expect(result.current.data).toStrictEqual(res));

    // expect(result.current.data.pages).toStrictEqual(generateMockedResponse(1));

    // const { data, fetchNextPage } = result.current;
    // console.log({ data });

    // expect(data.pages[0].items).toHaveLength(3);
    // console.log({ expectation });

    // // 10- Wait for the request to be success, otherwise it will fail the test.
    // await waitFor(() => result.current.isSuccess);
    // // 11- Comparing the results
    // expect(result.current.data?.pages[0]).toStrictEqual(
    //     generateMockedResponse(1)
    // );
});
