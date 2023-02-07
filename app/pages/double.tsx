import { Alert, Card } from "flowbite-react";
import { FormField } from "@/ui/FormField";
import { Stack } from "@/ui/Stack";
import { Toggle } from "@/ui/Toggle";
import React, { useCallback, useReducer } from "react";
import { PageLayout, Section } from "@/components/Layout";
import { useCircomNoirSwitch } from "@/hooks/useCircomNoirSwitch";
import { getService } from "@/services/double";
import { LoadingButton } from "@/ui/LoadingButton";
import {
  useNumericFieldChangeCallback,
  useStringFieldChangeCallback,
} from "@/hooks/utils";

type PageState = {
  a: number;
  b: number;
  c: number;
  d: number;
  proof: string;
  status: "success" | "error" | "reset";
  prooving: boolean;
  validating: boolean;
};

type PageEvents =
  | { type: "create_proof_requested" }
  | { type: "create_proof_complete"; proof: string; pubInput: string }
  | { type: "verify_proof_requested" }
  | { type: "verify_proof_complete"; status: "success" | "error" }
  | FieldEventsNum
  | FieldEventsStr;

type FieldEventsNum =
  | { type: "a_input_changed"; value: number }
  | { type: "b_input_changed"; value: number }
  | { type: "c_input_changed"; value: number }
  | { type: "d_input_changed"; value: number };

type FieldEventsStr = { type: "proof_input_changed"; value: string };

const initState: PageState = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  proof: "",
  status: "reset",
  prooving: false,
  validating: false,
};

const DoubleService = getService();

export default function Home() {
  const [{ a, b, c, d, proof, status, prooving, validating }, dispatch] =
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
        case "a_input_changed": {
          return {
            ...state,
            a: event.value,
          };
        }
        case "b_input_changed": {
          return {
            ...state,
            b: event.value,
          };
        }
        case "c_input_changed": {
          return {
            ...state,
            c: event.value,
          };
        }
        case "d_input_changed": {
          return {
            ...state,
            d: event.value,
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
    useCircomNoirSwitch();

  const onCreateProof = useCallback(async () => {
    if (!DoubleService) return;
    dispatch({ type: "create_proof_requested" });
    const p = await DoubleService.generateProof(backend, a, b, c, d);
    dispatch({
      type: "create_proof_complete",
      proof: p,
      pubInput: d.toString(),
    });
  }, [a, b, c, d, backend]);

  const onVerifyProof = useCallback(async () => {
    if (!DoubleService) return;
    dispatch({ type: "verify_proof_requested" });
    const isVerified = await DoubleService.verify(backend, proof, d);
    dispatch({
      type: "verify_proof_complete",
      status: isVerified ? "success" : "error",
    });
  }, [proof, d, backend]);

  const aChanged = useNumericFieldChangeCallback<FieldEventsNum>(
    "a_input_changed",
    dispatch
  );
  const bChanged = useNumericFieldChangeCallback<FieldEventsNum>(
    "b_input_changed",
    dispatch
  );
  const cChanged = useNumericFieldChangeCallback<FieldEventsNum>(
    "c_input_changed",
    dispatch
  );
  const dChanged = useNumericFieldChangeCallback<FieldEventsNum>(
    "d_input_changed",
    dispatch
  );
  const proofChanged = useStringFieldChangeCallback<FieldEventsStr>(
    "proof_input_changed",
    dispatch
  );

  return (
    <PageLayout title="Zero Knowledge" subtitle="Double">
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
              id="a"
              label={"Value for a"}
              value={a}
              onChange={aChanged}
              type="text"
              placeholder="Enter an integer"
            />
            <FormField
              id="b"
              label="Value for b"
              value={b}
              onChange={bChanged}
              type="text"
              placeholder="Enter an integer"
            />
            <FormField
              id="c"
              label="Value for c"
              value={c}
              onChange={cChanged}
              type="text"
              placeholder="Enter an integer"
            />
            <FormField
              id="d"
              label="Value for d"
              value={d}
              onChange={dChanged}
              type="text"
              placeholder="Enter an integer"
            />
            <LoadingButton
              onClick={onCreateProof}
              loading={prooving}
              fallback="Prooving..."
            >
              Generate proof that {a} * {b} * {c} = {d}
            </LoadingButton>
          </Stack>
        </Card>
      </Section>
      <Section>
        <Card>
          <Stack>
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
