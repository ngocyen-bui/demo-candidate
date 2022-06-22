import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/header";

export const candidateApi = createApi({
  reducerPath: "listCandidate",
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://lubrytics.com:8443/nadh-api-crm/api',
    prepareHeaders: headers => {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
        
            return headers
          },
  }),
  tagTypes: ["Candidates"],
  endpoints: (builder) => ({
    getAll: builder.query({
      query: (page=1) => `/candidates?page=${page}&perPage=10`,
      providesTags: [{ type: "Candidates", id: "LIST" }],
    }),
    addTodo: builder.mutation({
      query(text) {
        return {
          url: `candidates`,
          method: "POST",
          body: {
            text,
          },
        };
      },
      invalidatesTags: [{ type: "Candidates", id: "LIST" }],
    }),
    updateTodo: builder.mutation({
      query(todo) {
        return {
          url: `candidates/${todo.id}`,
          method: "PUT",
          body: todo,
        };
      },
      invalidatesTags: [{ type: "Candidates", id: "LIST" }],
    }),
    deleteTodo: builder.mutation({
      query(todo) {
        return {
          url: `candidates/${todo.id}`,
          method: "DELETE",
          body: todo,
        };
      },
      invalidatesTags: [{ type: "Candidates", id: "LIST" }],
    }),
  }),
});
