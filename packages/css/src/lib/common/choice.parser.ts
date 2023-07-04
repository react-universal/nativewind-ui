import { Parser, ParserState } from '../Parser';

export function choice<A>([p1]: [Parser<A>]): Parser<A>;
export function choice<A, B>([p1, p2]: [Parser<A>, Parser<B>]): Parser<A | B>;
export function choice<A, B, C>([p1, p2, p3]: [Parser<A>, Parser<B>, Parser<C>]): Parser<
  A | B | C
>;
export function choice<A, B, C, D>([p1, p2, p3, p4]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
]): Parser<A | B | C | D>;
export function choice<A, B, C, D, E>([p1, p2, p3, p4, p5]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
]): Parser<A | B | C | D | E>;
export function choice<A, B, C, D, E, F>([p1, p2, p3, p4, p5, p6]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
]): Parser<A | B | C | D | E | F>;
export function choice<A, B, C, D, E, F, G>([p1, p2, p3, p4, p5, p6]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
]): Parser<A | B | C | D | E | F | G>;
export function choice<A, B, C, D, E, F, G, H>([p1, p2, p3, p4, p5, p6, p7, p8]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
]): Parser<A | B | C | D | E | F | G | H>;
export function choice<A, B, C, D, E, F, G, H, I>([p1, p2, p3, p4, p5, p6, p7, p8, p9]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
]): Parser<A | B | C | D | E | F | G | H | I>;
export function choice<A, B, C, D, E, F, G, H, I, J>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
]): Parser<A | B | C | D | E | F | G | H | I | J>;
export function choice<A, B, C, D, E, F, G, H, I, J, K>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
  Parser<K>,
]): Parser<A | B | C | D | E | F | G | H | I | J | K>;
export function choice<A, B, C, D, E, F, G, H, I, J, K, L>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
  Parser<K>,
  Parser<L>,
]): Parser<A | B | C | D | E | F | G | H | I | J | K | L>;
export function choice<A, B, C, D, E, F, G, H, I, J, K, L, M>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
  Parser<K>,
  Parser<L>,
  Parser<M>,
]): Parser<A | B | C | D | E | F | G | H | I | J | K | L | M>;
export function choice<A, B, C, D, E, F, G, H, I, J, K, L, M, N>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
  p14,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
  Parser<K>,
  Parser<L>,
  Parser<M>,
  Parser<N>,
]): Parser<A | B | C | D | E | F | G | H | I | J | K | L | M | N>;
export function choice<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>([
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
]: [
  Parser<A>,
  Parser<B>,
  Parser<C>,
  Parser<D>,
  Parser<E>,
  Parser<F>,
  Parser<G>,
  Parser<H>,
  Parser<I>,
  Parser<J>,
  Parser<K>,
  Parser<L>,
  Parser<M>,
  Parser<N>,
  Parser<O>,
]): Parser<A | B | C | D | E | F | G | H | I | J | K | L | M | N | O>;
export function choice(parsers: Parser<any>[]): Parser<any>;
export function choice(parsers: Parser<any>[]): Parser<any> {
  if (parsers.length === 0) throw new Error(`List of parsers can't be empty.`);
  return new Parser((state) => {
    if (state.isError) return state;

    let error = null;
    for (const parser of parsers) {
      const out = parser.transform(state);

      if (!out.isError) return out;

      if (error === null || (error && out.cursor > error.cursor)) {
        error = out;
      }
    }

    return error as ParserState<any, any, any>;
  });
}
