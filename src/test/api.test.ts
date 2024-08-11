import { OperatorResponse, WeaponResponse } from "@/types/operator";

type APIResponse = {
  operatorData: OperatorResponse;
  weaponData: WeaponResponse;
  gadget: string[];
};

require("dotenv").config();

test("API returns the correct response structure", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=Ace`
  );
  const data = (await response.json()) as APIResponse;
  const status = response.status;

  expect(data).toHaveProperty("operatorData");
  expect(data).toHaveProperty("weaponData");
  expect(data).toHaveProperty("gadget");

  const operatorData = data.operatorData;
  const weaponData = data.weaponData;
  const gadget = data.gadget;

  expect(operatorData).toHaveProperty("operator");
  expect(operatorData).toHaveProperty("portrait");

  expect(weaponData).toHaveProperty("primary");
  expect(weaponData).toHaveProperty("secondary");

  expect(Array.isArray(gadget)).toBeTruthy();

  expect(status).toBe(200);
});

test("API contains correct operator information about an attacker", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=Ace`
  );
  const data = (await response.json()) as APIResponse;
  const status = response.status;
  const operator = data.operatorData.operator;

  expect(operator).toHaveProperty("id", 29);
  expect(operator).toHaveProperty("name", "Ace");
  expect(operator).toHaveProperty("primary");
  expect(operator).toHaveProperty("secondary");
  expect(operator).toHaveProperty("gadgets");

  expect(operator.primary).toContain("AK-12");
  expect(operator.primary).toContain("M1014");

  expect(operator.secondary).toContain("P9");

  expect(operator.gadgets).toContain("Breach Charge");
  expect(operator.gadgets).toContain("Claymore");

  expect(operator).toHaveProperty("side", "A");

  expect(status).toBe(200);
});

test("API contains correct operator information about a defender", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=Doc`
  );
  const data = (await response.json()) as APIResponse;
  const status = response.status;
  const operator = data.operatorData.operator;

  console.log(data);

  expect(operator).toHaveProperty("id", 43);
  expect(operator).toHaveProperty("name", "Doc");
  expect(operator).toHaveProperty("primary");
  expect(operator).toHaveProperty("secondary");
  expect(operator).toHaveProperty("gadgets");

  expect(operator.primary).toContain("SG-CQB");
  expect(operator.primary).toContain("MP5");
  expect(operator.primary).toContain("P90");

  expect(operator.secondary).toContain("P9");
  expect(operator.secondary).toContain("LFP586");
  expect(operator.secondary).toContain("Bailiff 410");

  expect(operator.gadgets).toContain("Barbed Wire");
  expect(operator.gadgets).toContain("Bulletproof Camera");

  expect(operator).toHaveProperty("side", "D");

  expect(status).toBe(200);
});

test("API identifies an invalid operator name", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=InvalidName`
  );
  const data = await response.json();
  const status = response.status;

  console.log(data);

  expect(data).toHaveProperty(
    "Error",
    "Cannot read properties of undefined (reading 'name')"
  );
  expect(status).toBe(404);
});
