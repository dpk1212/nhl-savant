# Custom Domain Setup - nhlsavant.com

## ✅ Step 1: CNAME File (DONE)

The `CNAME` file has been added to the `public/` directory with your domain:
```
nhlsavant.com
```

This file will be deployed with your site and tells GitHub Pages to use your custom domain.

---

## 📝 Step 2: Configure DNS Records

Go to your domain registrar (where you bought nhlsavant.com - e.g., GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

### Option A: Apex Domain Only (nhlsavant.com)

Add **4 A records** pointing to GitHub's IP addresses:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

### Option B: With WWW Subdomain (Recommended)

Add the **4 A records** above, PLUS:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | dpk1212.github.io |

This allows both `nhlsavant.com` and `www.nhlsavant.com` to work.

---

## 🚀 Step 3: Deploy to GitHub

After configuring DNS, push the CNAME file:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
git add public/CNAME
git commit -m "Add custom domain: nhlsavant.com"
git push origin main
```

This will trigger a deployment with the custom domain configuration.

---

## ⚙️ Step 4: GitHub Pages Settings

1. Go to your GitHub repo: **dpk1212/nhl-savant**
2. Navigate to **Settings** → **Pages**
3. Under "Custom domain", enter: `nhlsavant.com`
4. Click **Save**
5. Wait a few minutes for DNS to propagate
6. Check the box: **"Enforce HTTPS"** (once DNS is verified)

---

## ⏱️ Step 5: Wait for DNS Propagation

DNS changes can take **10 minutes to 48 hours** to fully propagate worldwide, but typically take **15-30 minutes**.

### Check DNS Propagation:
- Visit: https://www.whatsmydns.net/#A/nhlsavant.com
- Verify the A records show GitHub's IPs

### Test Your Site:
- Visit: http://nhlsavant.com (HTTP first)
- Once DNS propagates, GitHub will automatically issue an SSL certificate
- Then visit: https://nhlsavant.com (HTTPS - may take a few hours)

---

## 🔒 HTTPS Certificate

GitHub Pages will automatically provision a free SSL certificate from Let's Encrypt once:
1. DNS is properly configured
2. CNAME file is deployed
3. Custom domain is set in GitHub Pages settings

This usually takes **10-60 minutes** after DNS propagates.

---

## 🐛 Troubleshooting

### "Domain's DNS record could not be retrieved"
- DNS hasn't propagated yet (wait longer)
- DNS records are incorrect (double-check A records)
- TTL (Time To Live) is too high (lower to 300-600 seconds)

### "CNAME already taken"
- Another GitHub user is using this domain
- Make sure you own nhlsavant.com
- Remove CNAME from any other GitHub repos

### Site shows 404
- Wait for deployment to complete
- Check GitHub Actions for deployment status
- Verify CNAME file is in the deployed `dist/` folder

### Mixed Content Warnings
- Some resources loading over HTTP instead of HTTPS
- Update all absolute URLs to use `https://` or relative paths

---

## 📋 DNS Configuration Examples

### GoDaddy:
1. My Products → Domain → DNS
2. Add Record → Type: A, Name: @, Value: (GitHub IPs)

### Namecheap:
1. Domain List → Manage → Advanced DNS
2. Add New Record → Type: A Record, Host: @, Value: (GitHub IPs)

### Cloudflare:
1. DNS → Add record
2. Type: A, Name: @, IPv4 address: (GitHub IPs)
3. **Important:** Set Proxy status to "DNS only" (gray cloud)

---

## ✅ Verification Checklist

- [ ] CNAME file added to repo
- [ ] 4 A records pointing to GitHub IPs
- [ ] CNAME record for www (optional)
- [ ] Changes pushed to GitHub
- [ ] Custom domain set in GitHub Pages settings
- [ ] DNS propagation complete (check whatsmydns.net)
- [ ] HTTP site loads (http://nhlsavant.com)
- [ ] HTTPS enabled in GitHub settings
- [ ] HTTPS site loads (https://nhlsavant.com)
- [ ] WWW redirect works (if configured)

---

## 🎯 Expected Timeline

| Step | Time |
|------|------|
| DNS propagation | 15-60 minutes |
| GitHub deployment | 2-5 minutes |
| SSL certificate | 10-60 minutes after DNS |
| **Total** | **30 minutes - 2 hours** |

---

## 📚 Resources

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages IP Addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- [DNS Propagation Checker](https://www.whatsmydns.net)

---

**Status:** Ready to configure DNS
**Domain:** nhlsavant.com
**GitHub User:** dpk1212
**Repository:** nhl-savant

