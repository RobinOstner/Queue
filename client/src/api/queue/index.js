import request from "./request";

export default {
  createQueue: async function () {
    return request.post("/createQueue");
  }
}