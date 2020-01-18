import request from "./../request";

export default {
  search(
    q,
    offset,
    limit,
  ) {
    return request.get(`search`, {
      params: {
        q,
        type: 'track',
        limit,
        offset,
      }
    });
  }
};