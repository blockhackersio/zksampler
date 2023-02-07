use dep::std;

fn main(secret: Field) -> pub Field {
  let hash = std::hash::pedersen([secret]);
  hash[0]
}