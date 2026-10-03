# Derives which `fourgate init` flag produces which JSON key, for the /integrations
# explorer (src/content/init-example/flagmap.ts). Runs the real `fourgate init`
# (0.3.0) with the README example flags, then changes one flag at a time and diffs
# the three generated files by JSON path. Usage: FOURGATE=path/to/fourgate python scripts/derive-init-flagmap.py
import json, os, subprocess, sys, tempfile, shutil
FG = os.environ.get("FOURGATE", "fourgate")
base = {
  "--tool": "create_issue", "--test-account": "disposable-demo", "--id-path": "result.structuredContent.id",
  "--readback-url": "https://api.example.com/issues/{record_id}", "--expect": "title=title",
  "--arg": "title=FOURGATE-SCAN-TEST", "--token-env": "READBACK_TOKEN", "--missing-status": "404",
}
server = ["python", "your_server.py"]
variants = {
  "--tool": "create_ticket", "--test-account": "other-account", "--id-path": "result.structuredContent.issue_id",
  "--readback-url": "https://api.example.com/v2/issues/{record_id}", "--expect": "headline=title",
  "--arg": "title=OTHER-VALUE", "--token-env": "OTHER_TOKEN", "--missing-status": "410",
}
def run(flags, srv):
    d = tempfile.mkdtemp(dir=".")
    args = [FG, "init"]
    for k, v in flags.items(): args += [k, v]
    args += ["--dir", os.path.join(d, "cfg"), "--"] + srv
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: print("init failed", flags, r.stderr[:300]); sys.exit(1)
    out = {f: json.load(open(os.path.join(d, "cfg", f))) for f in ("readback.json", "runtime.json", "scan.json")}
    shutil.rmtree(d)
    return out
def flat(o, p=""):
    if isinstance(o, dict):
        r = {}
        for k, v in o.items():
            r[p + "/" + k] = v if not isinstance(v, (dict, list)) else None
            r.update(flat(v, p + "/" + k))
        return r
    if isinstance(o, list):
        r = {}
        for i, v in enumerate(o):
            r.update(flat(v, f"{p}/{i}") if isinstance(v, (dict, list)) else {f"{p}/{i}": v})
        return r
    return {p: o}
b = run(base, server)
json.dump(b, open("base.json", "w"), indent=2)
result = {}
def diff(o):
    ch = []
    for f in b:
        fb, fo = flat(b[f]), flat(o[f])
        for k in sorted(set(fb) | set(fo)):
            if fb.get(k, "<missing>") != fo.get(k, "<missing>"):
                ch.append(f"{f}:{k}")
    return ch
for flag, val in variants.items():
    v = dict(base); v[flag] = val
    result[flag] = diff(run(v, server))
result["-- (server command)"] = diff(run(base, ["python", "other_server.py"]))
for k, v in result.items(): print(k, "->", v)
json.dump(result, open("flagmap.json", "w"), indent=2)

v = dict(base); v["--arg"] = "body=FOURGATE-SCAN-TEST"; v["--expect"] = "title=body"
print("arg name via --expect/--arg ->", diff(run(v, server)))
