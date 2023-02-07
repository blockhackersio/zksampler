fn mult(a: Field, b: Field) -> pub Field {
    a * b
}

fn main(a: Field, b: Field, c: Field) -> pub Field {
    mult(mult(a, b), c)
}
