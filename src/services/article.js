// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

// const options = {
//   method: "GET",
//   url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize",
//   params: {
//     url: "https://time.com/6266679/musk-ai-open-letter/",
//     lang: "en",
//     engine: "2",
//   },
//   headers: {
//     "x-rapidapi-key": "07e168b742mshcc604a15c145985p1a97c3jsn9a2c5bf53cc5",
//     "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
//   },
// };

// export const articleApi = createApi({
//   reducerPath: "articleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
//     prepareHeaders: (headers) => {
//       headers.set("X-RapidAPI-Key", rapidApiKey);
//       headers.set(
//         "X-RapidAPI-Host",
//         "article-extractor-and-summarizer.p.rapidapi.com"
//       );

//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getSummary: builder.query({
//       // encodeURIComponent() function encodes special characters that may be present in the parameter values
//       // If we do not properly encode these characters, they can be misinterpreted by the server and cause errors or unexpected behavior. Thus that RTK bug
//       query: (params) =>
//         `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
//     }),
//   }),
// });

// export const { useLazyGetSummaryQuery } = articleApi

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { HuggingFaceProvider } from "langchain/providers/huggingface";

// const hfApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// const hfProvider = new HuggingFaceProvider({
//   apiKey: hfApiKey,
//   model: "facebook/bart-large-cnn", // Your chosen model
// });

// export const articleApi = createApi({
//   reducerPath: "articleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://api.huggingface.co",
//     prepareHeaders: (headers) => {
//       headers.set("Authorization", `Bearer ${hfApiKey}`);
//       headers.set("Content-Type", "application/json");
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getSummary: builder.query({
//       query: (params) => ({
//         url: `/models/facebook/bart-large-cnn`,
//         method: "POST",
//         body: {
//           inputs: params.articleUrl,
//         },
//       }),
//       transformResponse: (response) => hfProvider.summarize(response),
//     }),
//   }),
// });

// export const { useLazyGetSummaryQuery } = articleApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const hfApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// export const articleApi = createApi({
//   reducerPath: "articleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://api-inference.huggingface.co",
//     prepareHeaders: (headers) => {
//       headers.set("Authorization", `Bearer ${hfApiKey}`);
//       headers.set("Content-Type", "application/json");
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getSummary: builder.query({
//       query: (params) => ({
//         url: `/models/facebook/bart-large-cnn`,
//         method: "POST",
//         body: JSON.stringify({
//           inputs: params.articleUrl,
//           parameters: {
//             max_length: 1200, // Increase this value for longer summaries
//             min_length: 300, // Ensures a minimum length
//           },
//         }),
//       }),
//       // transformResponse: (response) => {
//       //   console.log("API Response:", response); // Debugging log

//       //   if (
//       //     !response ||
//       //     typeof response !== "object" ||
//       //     response.length === 0
//       //   ) {
//       //     console.error("Invalid API response:", response);
//       //     return { summary: "Error: No summary available. Try again later." };
//       //   }

//       //   const summaryText =
//       //     response[0]?.summary_text || "No summary available.";

//       //   // Ensure paragraph breaks by splitting on periods
//       //   const formattedSummary = summaryText
//       //     .split(". ")
//       //     .map((sentence) => sentence.trim())
//       //     .filter((sentence) => sentence.length > 0)
//       //     .join(".\n\n"); // Insert paragraph breaks

//       //   return { summary: formattedSummary };
//       // },
//       // transformResponse: (response) => {
//       //   console.log("API Response:", response); // Debugging log

//       //   if (
//       //     !response ||
//       //     typeof response !== "object" ||
//       //     response.length === 0
//       //   ) {
//       //     console.error("Invalid API response:", response);
//       //     return { summary: "Error: No summary available. Try again later." };
//       //   }

//       //   const summaryText =
//       //     response[0]?.summary_text || "No summary available.";

//       //   // Split the summary into paragraphs using two or more line breaks as a delimiter
//       //   const paragraphs = summaryText.split(/\n{2,}/); // Split on two or more newlines (paragraph boundary)

//       //   // Join the paragraphs with double line breaks for readability
//       //   const formattedSummary = paragraphs
//       //     .map((paragraph) => paragraph.trim())
//       //     .filter((paragraph) => paragraph.length > 0)
//       //     .join("\n\n"); // Add a line break between paragraphs

//       //   return { summary: formattedSummary };
//       // },
//       transformResponse: (response) => {
//         console.log("API Response:", response);

//         if (
//           !response ||
//           typeof response !== "object" ||
//           response.length === 0
//         ) {
//           console.error("Invalid API response:", response);
//           return { summary: "Error: No summary available. Try again later." };
//         }

//         const summaryText =
//           response[0]?.summary_text || "No summary available.";

//         // Split into sentences using periods followed by whitespace
//         const sentences = summaryText
//           .split(/\.\s+/)
//           .filter((s) => s.trim() !== "");

//         // Add periods back to sentences and handle the last sentence
//         const sentencesWithPeriods = sentences.map((sentence, index) => {
//           if (index === sentences.length - 1 && sentence.endsWith(".")) {
//             return sentence;
//           }
//           return sentence + ".";
//         });

//         // Group sentences into paragraphs of 2 sentences each
//         const paragraphs = [];
//         for (let i = 0; i < sentencesWithPeriods.length; i += 4) {
//           const chunk = sentencesWithPeriods.slice(i, i + 4).join(" ");
//           paragraphs.push(chunk);
//         }

//         // Join paragraphs with double newlines
//         const formattedSummary = paragraphs.join("\n\n");

//         return { summary: formattedSummary };
//       },
//     }),
//   }),
// });

// export const { useLazyGetSummaryQuery } = articleApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const hfApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api-inference.huggingface.co",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${hfApiKey}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) => ({
        url: `/models/facebook/bart-large-cnn`,
        method: "POST",
        body: JSON.stringify({
          inputs: params.articleText, // Ensure it's a string
          parameters: {
            max_length: 1200,
            min_length: 300,
          },
        }),
      }),
      transformResponse: (response) => {
        console.log("API Response:", response);

        if (
          !response ||
          typeof response !== "object" ||
          response.length === 0
        ) {
          console.error("Invalid API response:", response);
          return { summary: "Error: No summary available. Try again later." };
        }

        const summaryText =
          response[0]?.summary_text || "No summary available.";

        // Split into sentences using periods followed by whitespace
        const sentences = summaryText
          .split(/\.\s+/)
          .filter((s) => s.trim() !== "");

        // Add periods back to sentences and handle the last sentence
        const sentencesWithPeriods = sentences.map((sentence, index) => {
          if (index === sentences.length - 1 && sentence.endsWith(".")) {
            return sentence;
          }
          return sentence + ".";
        });

        // Group sentences into paragraphs of 2 sentences each
        const paragraphs = [];
        for (let i = 0; i < sentencesWithPeriods.length; i += 4) {
          const chunk = sentencesWithPeriods.slice(i, i + 4).join();
          paragraphs.push(chunk);
        }

        // Join paragraphs with double newlines
        const formattedSummary = paragraphs.join("\n\n");

        return { summary: formattedSummary };
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
