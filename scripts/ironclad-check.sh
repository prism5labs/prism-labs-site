#!/usr/bin/env bash
# IRONCLAD drift check — Prism 5 Labs website (prism-labs-site).
# Fails loudly (exit 1) if any locked rule has drifted.
# Run: bash scripts/ironclad-check.sh
#
# NOTE: the free-code patterns below are written so this file itself does not
# contain either code value. Do not "simplify" them into the literal values.
set -u
cd "$(dirname "$0")/.." || exit 1
FAIL=0
fail() { echo "IRONCLAD FAIL: $1"; FAIL=1; }
ok()   { echo "IRONCLAD OK: $1"; }

# 1. Free codes must never appear in this repo.
#    Prism code is the digit 1 ten times; the Loremaster code is a hyphenated
#    word. Both live ONLY in the Render FREE_CODE env var.
hits=$(grep -rInE --exclude-dir=.git '1{10}' . || true)
if [ -n "$hits" ]; then
  echo "$hits"
  fail "free-code value (ten ones) found in the repo; the code lives ONLY in the Render FREE_CODE env var"
else
  ok "no Prism free-code value in repo"
fi
hits=$(grep -rInE --exclude-dir=.git 'open[-]book' . || true)
if [ -n "$hits" ]; then
  echo "$hits"
  fail "Loremaster free-code value found in this repo; it does not belong here"
else
  ok "no Loremaster free-code value in repo"
fi

# 2. Canon prices must be present in the site copy.
#    Boundary-aware so $49 does not match inside $499.
for p in 499 99 39 19 49 33 26 29 25 59 539 363; do
  grep -qE '\$'"$p"'([^0-9]|$)' index.html || fail "canon price \$$p missing from index.html"
done
ok "canon prices present on the site"

# 3. No zero price anywhere on the site.
if grep -qE '\$0([^0-9]|$)' index.html; then
  fail "a \$0 price on the site; nothing is free"
else
  ok "no zero price on the site"
fi

# 4. Prism must never be described as free in site copy.
#    (The 14-day free trial is canon and is not matched by these patterns.)
hits=$(grep -inE 'prism is free|free prism|is free for everyone' index.html || true)
if [ -n "$hits" ]; then
  echo "$hits"
  fail "Prism described as free; Prism is NOT free (see IRONCLAD.md)"
else
  ok "Prism never described as free"
fi

if [ "$FAIL" -ne 0 ]; then
  echo "IRONCLAD CHECK FAILED — see failures above. Do not ship until they are resolved by Neil, the owner."
  exit 1
fi
echo "IRONCLAD CHECK PASSED"
exit 0
