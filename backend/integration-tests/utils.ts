import request from "supertest";

const username = createRandomName();
const password = createRandomName();

/**
 * Registers a new user and returns token
 */
export async function registerUser(
  api: ReturnType<typeof request>
): Promise<string> {
  const response = await api
    .post("/signup")
    .set("Content-Type", "application/json")
    .send({ username, password })
    .expect(201);

  return response.body.token as string;
}

// create 16 random characters, should be good enough for unique names
function createRandomName() {
  const randomOffset = () => Math.floor(Math.random() * 26);

  let result = "";
  for (let i = 0; i < 16; i++) {
    result += String.fromCharCode(97 + randomOffset());
  }

  return result;
}
