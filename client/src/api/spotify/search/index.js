import request from "./../request";

export default {
  search(
    q,
    type = "track",
    offset,
    limit,
  ) {
    return request.get(`search`, {
      params: {
        q,
        type,
        limit,
        offset,
      }
    });
  }
};