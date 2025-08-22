---
title: '2025省赛预选赛补题'
tags: [ '题解' ]
publishDate: '2025-04-27'
description: '由成信大出题'
heroImage: { src: './scenery/8.webp', color: '#4891B2' }
language: 'zh-cn'
---

(cf补题链接)[https://codeforces.com/gym/606649] 

# H

## 题目描述

> 给定三个数组$A$, $B$, $C$,长度分别为 $n$, $m$, $p$,每个数组取一个数求和，输出前$k$个最大值。
>
>
数据范围： $l \le n,m,p \le 1000$, $1 \le k \le min(3000, n \times m \times p)$ , $0 \le A_{i}, B_{i}, C_{i} \le  10000000000$

## 解题思路

> 首先想到的最简单的思路是暴力求解，这样的时间复杂度将会是$1e^{9} \log_{2} ^{1e^{9}}$ ，如何优化呢？  
> 我们可以将其中两个数组合并，这里我们选择将$A, B$ 两个数组合并，然后进行排序，这里复杂度为$1e^{6}\log_{2}^{1e^{6}}$,
> 我么选择合并后的前$k$个最大值和数组$C$合并，这里的复杂度为$3e^{3} \times 1e^{3}$, 可以用堆维护$k$个数。

## 参考代码

```cpp  
#include<bits/stdc++.h>  
  
using i128 = __int128;  
#define endl '\n'  
#define int long long  
#define pii std::pair<int ,int>  
#define fix(x) std::fixed << std::setprecision(x)  
const int inf = 1e17 + 50, MAX_N = 1e5 + 50, mod = 1e9 + 7;  
  
void solve() {  
  int n, m, p, k;  
  std::cin >> n >> m >> p >> k;  
  std::vector<int> a(n), b(m), c(p);  
  for(int i = 0; i < n; i++) std::cin >> a[i];  
  for(int i = 0; i < m; i++) std::cin >> b[i];  
  for(int i = 0; i < p; i++) std::cin >> c[i];  
  std::vector<int> ab;  
  for(int i = 0; i < n; i++) {  
   for(int j = 0; j < m; j++) {  
    ab.push_back(a[i] + b[j]);  
   }  
  }  
  std::sort(ab.begin(), ab.end(), std::greater<>());  
  std::sort(c.begin(), c.end(), std::greater<>());  
  std::priority_queue<int, std::vector<int>, std::greater<> > pq;  
  for(int i = 0; i < std::min(k, (int) ab.size()); i++) {  
   for(int j = 0; j < p; j++) {  
    int t = ab[i] + c[j];  
    if (pq.size() == k) {  
     auto w = pq.top();  
     if (w < t) {  
      pq.pop();  
      pq.push(t);  
     }  
    } else {  
     pq.push(t);  
    }  
   }  
  }  
  std::vector<int> res;  
  while (!pq.empty()) {  
   res.push_back(pq.top());  
   pq.pop();  
  }  
  std::reverse(res.begin(), res.end());  
  for(auto i : res) {  
   std::cout << i << endl;  
  }  
}  
  
signed main() {  
  std::ios::sync_with_stdio(false);  
  std::cin.tie(nullptr), std::cout.tie(nullptr);  
  solve();  
  return 0;  
}  
```

# E

## 题目描述

> 给定一个长度为$n$的数组$A$, 有$q$次询问,每次给出$l, r, start, end$, 对于每次询问，我们要输出$A$中在区间段$[l,r]$
> 中,$start \le A_{i} \le end$的数的个数。
>
> 数据范围：$1 \le N, q \le 10^{5}, -10^{12} \le A_{i} \le 10^{12}$

## 解题思路

> 赛时，我想的是对区间内的数排序,然后二分查找边界,计算数量,奈何`TLE`,tql,显然是排序超时了。  
> 正解是树状数组或者线段树

## 参考代码

```cpp  
#include<bits/stdc++.h>  
  
using i128 = __int128;  
#define int long long  
#define endl '\n'  
#define pii std::pair<int ,int>  
#define fix(x) std::fixed << std::setprecision(x)  
const int inf = 1e17 + 50, MAX_N = 1e5 + 50, mod = 1e9 + 7;  
std::mt19937_64 rng(std::chrono::system_clock::now().time_since_epoch().count());  
std::vector<int> a(MAX_N);  
struct Node {  
  int l{}, r{};  
  std::vector<int> sorted;  
};  
  
Node tr[4 * MAX_N];  
  
void build(int u, int l, int r) {  
  tr[u].l = l;  
  tr[u].r = r;  
  tr[u].sorted.clear();  
  if (l == r) {  
   tr[u].sorted.push_back(a[l]);  
   return;  
  }  
  int mid = (l + r) / 2;  
  build(u << 1, l, mid);  
  build(u << 1 | 1, mid + 1, r);  
  auto &left = tr[u << 1].sorted;  
  auto &right = tr[u << 1 | 1].sorted;  
  tr[u].sorted.resize(left.size() + right.size());  
  merge(left.begin(), left.end(), right.begin(), right.end(), tr[u].sorted.begin());  
}  
  
int query(int u, int l, int r, int start, int end) {  
  if (tr[u].r < l || tr[u].l > r) {  
   return 0;  
  }  
  if (l <= tr[u].l && tr[u].r <= r) {  
   auto &v = tr[u].sorted;  
   int left_pos = lower_bound(v.begin(), v.end(), start) - v.begin();  
   int right_pos = upper_bound(v.begin(), v.end(), end) - v.begin();  
   return right_pos - left_pos;  
  }  
  return query(u << 1, l, r, start, end) + query(u << 1 | 1, l, r, start, end);  
}  
  
void solve() {  
  int N, Q;  
  std::cin >> N >> Q;  
  for(int i = 1; i <= N; ++i) {  
   std::cin >> a[i];  
  }  
  build(1, 1, N);  
  while (Q--) {  
   int l, r, s, e;  
   std::cin >> l >> r >> s >> e;  
   std::cout << query(1, l, r, s, e) << endl;  
  }  
}  
  
signed main() {  
  std::ios::sync_with_stdio(false);  
  std::cin.tie(nullptr), std::cout.tie(nullptr);  
  solve();  
  return 0;  
}  
```
