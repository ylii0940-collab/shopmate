#!/bin/zsh
# 双击启动；密钥只从终端环境或本地 .env 读取。
cd -- "$(dirname -- "$0")" || exit 1
LIVEPILOT_NODE=""
for LIVEPILOT_CANDIDATE in "$HOME"/.nvm/versions/node/v*/bin/node(N) /usr/local/bin/node /opt/homebrew/bin/node; do
  if [[ -x "$LIVEPILOT_CANDIDATE" ]]; then
    LIVEPILOT_MAJOR=$("$LIVEPILOT_CANDIDATE" -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null)
    if [[ "$LIVEPILOT_MAJOR" -ge 22 ]]; then
      LIVEPILOT_NODE="$LIVEPILOT_CANDIDATE"
      break
    fi
  fi
done
if [[ -z "$LIVEPILOT_NODE" ]] && command -v node >/dev/null 2>&1; then
  LIVEPILOT_CANDIDATE=$(command -v node)
  LIVEPILOT_MAJOR=$("$LIVEPILOT_CANDIDATE" -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null)
  if [[ "$LIVEPILOT_MAJOR" -ge 22 ]]; then LIVEPILOT_NODE="$LIVEPILOT_CANDIDATE"; fi
fi
if [[ -z "$LIVEPILOT_NODE" ]]; then
  print '需要 Node.js 22 或以上版本。请安装后再次双击启动。'
  read '?按回车键退出…'
  exit 1
fi
print 'ShopMate · 国际电商导购助手'
print '启动后访问：http://127.0.0.1:8530'
print '请保持此窗口开启；按 Ctrl+C 停止服务。'
if /usr/bin/curl -fsS --max-time 2 http://127.0.0.1:8530/api/health 2>/dev/null | /usr/bin/grep -q '"data":"simulated"'; then
  print '\nShopMate 已在运行，可以直接打开上面的地址。'
  read '?按回车键关闭这个提示窗口…'
  exit 0
fi
if [[ -f .env ]]; then
  "$LIVEPILOT_NODE" --env-file=.env server.mjs
else
  "$LIVEPILOT_NODE" server.mjs
fi
read '?服务已停止，按回车键退出…'
