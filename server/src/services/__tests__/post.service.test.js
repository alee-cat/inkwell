// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = { createWithTags: jest.fn() };
const mockEventBus = { emit: jest.fn() };
const mockSearchStrategy = {
  search: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
    PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
    EventBus: mockEventBus,
}));

jest.unstable_mockModule("../search/substring-search.strategy.js", () => ({
  SubstringSearchStrategy: mockSearchStrategy,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
    mockPostRepository.createWithTags.mockResolvedValue({ id: "p1", title: "Hello", status: "PUBLISHED" });

    const post = await PostService.publish({ authorId: "u1", title: "Hello", body: "World" });

    expect(post.status).toBe("PUBLISHED");
    expect(mockEventBus.emit).toHaveBeenCalledWith(
        "post.published",
        expect.objectContaining({ postId: "p1" })
    );
});

test("publish() rejects an empty title", async () => {
    await expect(
        PostService.publish({ authorId: "u1", title: "", body: "World" })
    ).rejects.toThrow();
});

test("search() returns results for a query", async () => {
    const mockResults = [
        { id: "p1", title: "First Blog Post" },
    ];

    mockSearchStrategy.search.mockResolvedValue(mockResults);

    const result = await PostService.search({
        query: "meow",
    });

    expect(result).toEqual(mockResults);

    expect(mockSearchStrategy.search).toHaveBeenCalledWith(
        "meow",
        { page: 1, pageSize: 10 }
    );
});

test("search() handles an empty query", async () => {
    mockSearchStrategy.search.mockResolvedValue([]);

    const result = await PostService.search({
        query: "",
    });

    expect(result).toEqual([]);

    expect(mockSearchStrategy.search).toHaveBeenCalledWith(
        "",
        { page: 1, pageSize: 10 }
    );
});

test("search() returns no results", async () => {
    mockSearchStrategy.search.mockResolvedValue([]);

    const result = await PostService.search({
        query: "paws",
    });

    expect(result).toEqual([]);
});

test("search() returns multiple results", async () => {
    const mockResults = [
        { id: "p1", title: "First Blog Post" },
        { id: "p2", title: "Second Blog Post" },
        { id: "p3", title: "Third Blog Post" },
    ];

    mockSearchStrategy.search.mockResolvedValue(mockResults);

    const result = await PostService.search({
        query: "cat",
    });

    expect(result).toEqual(mockResults);
    expect(result).toHaveLength(3);
});