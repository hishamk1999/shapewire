import { rename } from "./rename";

const transform = rename({ user_id: "id", full_name: "name" });

console.log(transform({ user_id: 1, full_name: "Sara" }));
