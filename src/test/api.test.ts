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

test("API returns correct operator information about an operator", async () => {
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

test("API contains correct weapon structure", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=Ace`
  );
  const data = (await response.json()) as APIResponse;
  const status = response.status;
  const primaryWeaponData = data.weaponData.primary;
  const secondaryWeaponData = data.weaponData.secondary;

  expect(primaryWeaponData).toHaveProperty("name");
  expect(primaryWeaponData).toHaveProperty("type");
  expect(primaryWeaponData).toHaveProperty("scope");
  expect(primaryWeaponData).toHaveProperty("barrel");
  expect(primaryWeaponData).toHaveProperty("grip");
  expect(primaryWeaponData).toHaveProperty("underbarrel");
  expect(primaryWeaponData).toHaveProperty("icon_url");

  expect(secondaryWeaponData).toHaveProperty("name");
  expect(secondaryWeaponData).toHaveProperty("type");
  expect(secondaryWeaponData).toHaveProperty("scope");
  expect(secondaryWeaponData).toHaveProperty("barrel");
  expect(secondaryWeaponData).toHaveProperty("grip");
  expect(secondaryWeaponData).toHaveProperty("underbarrel");
  expect(secondaryWeaponData).toHaveProperty("icon_url");

  expect(status).toBe(200);
});

test("API contains correct information a shield operator", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=Clash`
  );
  const data = (await response.json()) as APIResponse;
  const status = response.status;
  const primaryWeaponData = data.weaponData.primary;

  let expectedResponse = {
    type: "NA",
    icon_url: "",
  };

  expect(primaryWeaponData).toHaveProperty("name", "CCE SHIELD");
  expect(primaryWeaponData).toHaveProperty("type", "Shield");
  expect(primaryWeaponData).toHaveProperty("barrel", expectedResponse);
  expect(primaryWeaponData).toHaveProperty("scope", expectedResponse);
  expect(primaryWeaponData).toHaveProperty("grip", expectedResponse);
  expect(primaryWeaponData).toHaveProperty("underbarrel", expectedResponse);

  expect(status).toBe(200);
});

test("API identifies an invalid operator name", async () => {
  const response = await fetch(
    `${process.env.TEST_DOMAIN}/api/operators?name=InvalidName`
  );
  const data = await response.json();
  const status = response.status;

  expect(data).toHaveProperty(
    "Error",
    "Cannot read properties of undefined (reading 'name')"
  );
  expect(status).toBe(404);
});
