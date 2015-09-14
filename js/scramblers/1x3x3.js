(function(circle) {
	function search(idx, maxl, lm, sol) {
		if (maxl == 0) {
			return idx == 0;
		}
		var h, g, f, i;
		for (i = 0; i < 4; i++) if (i != lm && search(doMove(idx, i), maxl - 1, i, sol)) {
			sol.push("RLFB".charAt(i))
			return true;
		}
	}
	function doMove(idx, m) {
		var perm = idx >> 4;
		var ori = idx & 15;
		var g = [];
		mathlib.set8Perm(g, perm, 4);
		if (m == 0) {
			circle(g, 0, 1);
		} else if (m == 1) {
			circle(g, 2, 3);
		} else if (m == 2) {
			circle(g, 0, 3);
		} else if (m == 3) {
			circle(g, 1, 2);
		}
		return (mathlib.get8Perm(g, 4) << 4) + (ori ^ (1 << m));
	}
	function generateScramble() {
//		init();
		var a = 0;
		var c = 1 + mathlib.rn(191),
		d = [];
		c = c * 2 + ((mathlib.getNParity(c >> 3, 4) ^ (c >> 1) ^ (c >> 2) ^ c) & 1);
		if (0 != c) for (; 99 > a && !search(c, a, -1, d); a++) {};
		return d.reverse().join(" ")
	}
	scramble.reg('133', generateScramble);
}) (mathlib.circle);
