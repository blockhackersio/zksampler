import { Alert, Card } from "flowbite-react";
import { FormField } from "@/ui/FormField";
import { Stack } from "@/ui/Stack";
import { Toggle } from "@/ui/Toggle";
import React, { useCallback, useReducer } from "react";
import { PageLayout, Section } from "@/components/Layout";
import { useCircomNoirSwitch } from "@/hooks/useCircomNoirSwitch";
import { getService } from "@/services/pedersen";
import { LoadingButton } from "@/ui/LoadingButton";
import { useStringFieldChangeCallback } from "@/hooks/utils";

type PageState = {
  password: string;
  hash: string;
  proof: string;
  status: "success" | "error" | "reset";
  prooving: boolean;
  validating: boolean;
};

type PageEvents =
  | { type: "create_proof_requested" }
  | { type: "create_proof_complete"; proof: string }
  | { type: "verify_proof_requested" }
  | { type: "verify_proof_complete"; status: "success" | "error" }
  | FieldEventsStr;

type FieldEventsStr =
  | { type: "password_input_changed"; value: string }
  | { type: "hash_input_changed"; value: string }
  | { type: "proof_input_changed"; value: string };

const initState: PageState = {
  password: "",
  proof: "",
  hash: "",
  status: "reset",
  prooving: false,
  validating: false,
};

const PedersenService = getService();

export default function Home() {
  const [{ password, proof, hash, status, prooving, validating }, dispatch] =
    useReducer((state: PageState, event: PageEvents): PageState => {
      switch (event.type) {
        case "create_proof_requested": {
          return {
            ...state,
            prooving: true,
            proof: "",
            status: "reset",
          };
        }
        case "create_proof_complete": {
          return {
            ...state,
            proof: event.proof,
            prooving: false,
          };
        }
        case "verify_proof_complete": {
          return {
            ...state,
            validating: false,
            status: event.status,
          };
        }
        case "verify_proof_requested": {
          return {
            ...state,
            status: "reset",
            validating: true,
          };
        }
        case "password_input_changed": {
          return {
            ...state,
            password: event.value,
          };
        }
        case "hash_input_changed": {
          return {
            ...state,
            hash: event.value,
          };
        }
        case "proof_input_changed": {
          return {
            ...state,
            proof: event.value,
          };
        }
        default: {
          return state;
        }
      }
    }, initState);

  const [backend, onToggleChange, toggleValue, toggleText] =
    useCircomNoirSwitch("circom");

  const onCreateProof = useCallback(async () => {
    if (!PedersenService) return;
    dispatch({ type: "create_proof_requested" });
    const hash = await PedersenService.generateHash(backend, password);
    dispatch({ type: "hash_input_changed", value: hash });
    const proof = await PedersenService.generateProof(backend, password, hash);
    dispatch({
      type: "create_proof_complete",
      proof,
    });
  }, [password, backend]);

  const onVerifyProof = useCallback(async () => {
    if (!PedersenService) return;
    dispatch({ type: "verify_proof_requested" });
    const isVerified = await PedersenService.verify(backend, proof, hash);
    dispatch({
      type: "verify_proof_complete",
      status: isVerified ? "success" : "error",
    });
  }, [proof, hash, backend]);

  const passwordChanged = useStringFieldChangeCallback<FieldEventsStr>(
    "password_input_changed",
    dispatch
  );

  const hashChanged = useStringFieldChangeCallback<FieldEventsStr>(
    "hash_input_changed",
    dispatch
  );

  const proofChanged = useStringFieldChangeCallback<FieldEventsStr>(
    "proof_input_changed",
    dispatch
  );

  return (
    <PageLayout title="Zero Knowledge" subtitle="Pedersen Hash">
      <Section>
        <Card>
          <Stack>
            <Toggle
              off="Circom"
              on="Noir"
              value={toggleValue}
              onChange={onToggleChange}
            ></Toggle>
            <FormField
              id="password"
              label={"Your password"}
              value={password}
              onChange={passwordChanged}
              type="text"
              placeholder="Enter a password"
            />
            <LoadingButton
              onClick={onCreateProof}
              loading={prooving}
              fallback="Prooving..."
            >
              Generate hash and proof
            </LoadingButton>
          </Stack>
        </Card>
      </Section>
      <Section>
        <Card>
          <Stack>
            <FormField
              id="hash"
              label={"The hash"}
              value={hash}
              onChange={hashChanged}
              type="text"
              placeholder="A hash of a secret"
            />
            <FormField
              label="The Proof"
              textarea={true}
              id="proof"
              value={proof}
              onChange={proofChanged}
              placeholder="Proof will populate here..."
              rows={10}
            />
            <LoadingButton
              onClick={onVerifyProof}
              loading={validating}
              fallback="Verifying..."
            >
              Verify proof
            </LoadingButton>
            {status === "success" && (
              <Alert color="success">Proof was correctly verified</Alert>
            )}
            {status === "error" && <Alert color="failure">Proof failed</Alert>}
          </Stack>
        </Card>
      </Section>
    </PageLayout>
  );
}
