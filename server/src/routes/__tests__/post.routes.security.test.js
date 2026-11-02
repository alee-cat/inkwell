
import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

const mockPostService = {
    listPublished: jest.fn(),
    search: jest.fn(),
};

jest.unstable_mockModule("../../services/post.service.js", () => ({
    PostService: mockPostService,
}));

jest.unstable_mockModule("../../middleware/auth.middleware.js", () => ({
    requireAuth: (req, res, next) => next(),
}));

const { default: postRouter } = await import("../post.routes.js");

const app = express();
app.use(express.json());
app.use("/api", postRouter);

beforeEach(() => {
    jest.clearAllMocks();
});

describe("GET /api/posts pageSize security", () => {
    test("limits pageSize to 40", async () => {
        mockPostService.listPublished.mockResolvedValue({
            posts: [],
            page: 1,
            hasMore: false,
        });

        const response = await request(app).get("/api/posts?pageSize=1000");

        expect(response.status).toBe(200);
        expect(mockPostService.listPublished).toHaveBeenCalledWith({
            page: 1,
            pageSize: 40,
        });
    });
});
