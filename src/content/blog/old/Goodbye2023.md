---
title: 'Goodbye2023'
tags: [ '题解', 'codeforces' ]
publishDate: '2023-12-31 23:44:55'
description: 'codeforces-goodbye2023(A-C)'
heroImage: { src: './scenery/8.webp', color: '#4891B2' }
language: 'zh-cn'
---
# A [2023](https://codeforces.com/contest/1916/problem/A)

## 题目描述

> 给定 `n`个数，让我们判断是否能与 `m`个数相乘后可以得到 `2023`，并且将这些数输出出来

## 解题思路

> 我们只需要判断这些数能否被2023整除。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
#define endl '\n'
#define fix(n) std::fixed << std::setprecision(n)
[[maybe_unused]]typedef std::pair<int, int> pii;
[[maybe_unused]]const int INF = 1e18 + 50;

void solve() {
    int s = 2023;
    int n, m;
    std::cin >> n >> m;
    std::vector<int> a(n);
    for (int i = 0; i < n; i++) std::cin >> a[i];
    for (int i = 0; i < n; i++)
        if (s % a[i]) {
            std::cout << "NO" << endl;
            return;
        } else {
            s /= a[i];
        }
    std::cout << "YES" << endl;
    for (int i = 0; i < m - 1; i++)
        std::cout << 1 << " ";
    std::cout << s << endl;
}

signed main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr), std::cout.tie(nullptr);
    int Lazy_boy_ = 1;
    std::cin >> Lazy_boy_;
    while (Lazy_boy_--)
        solve();
    return 0;
}
```

---

# B  [Two Divisors](https://codeforces.com/contest/1916/problem/B)

## 题目描述

> 选择一个 (1 <= x <= 1e9) 的数。同时满足 1≤a<b<x 的条件。
> 对于给定的数 a、b，你需要求出 x 的值。
> 如果有整数 k，使得 x=y⋅k, 则数 y 是数 x 的除数。

## 解题思路

> 首先你得要知道，你需要这个值有a和b，那么是和lcm(a,b)是有关系的，默认a<b，然后其次你发现，lcm(a,b)如果和b一样的话，那么你的这个值，实际上他会选不到b，那么我们需要把这个值增加一些，并且不影响答案。那么这个增加的值实际上就是lcm(a,b)/a，首先这题有解，那么lcm(a,b)一定有a和b的因子，由于他们是最大的，所以我们需要乘一个小数，去使得能选到b，但是a和b仍然是最大两个，所以当你的lcm(a,b)不是b的时候，那么lcm(a,b)就是答案，否则，答案应该乘上一个小值，那么乘上什么值是正确的，首先我们要理解，肯定不能让a变成除了b以外的数字，那么就是乘上一个lcm(a,b)/a，乘上这个值之后，他们的因子没有出现新大数。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
#define endl '\n'
#define fix(n) std::fixed << std::setprecision(n)
[[maybe_unused]]typedef std::pair<int, int> pii;
[[maybe_unused]]const int INF = 1e18 + 50;

void solve() {
    int a, b;
    std::cin >> a >> b;
    if (b % a)
        std::cout << a * b / std::gcd(a, b) << endl;
    else
        std::cout << b * b / a << endl;
}

signed main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr), std::cout.tie(nullptr);
    int Lazy_boy_ = 1;
    std::cin >> Lazy_boy_;
    while (Lazy_boy_--)
        solve();
    return 0;
}
```

---

# C  [Training Before the Olympiad](https://codeforces.com/contest/1916/problem/C)

## 题目描述

> 玛莎和奥丽雅马上就要参加一个重要的团队奥林匹克竞赛了。为此，玛莎建议和奥丽雅玩一个热身游戏：
> 有一个大小为 n 的数组 a。马莎先走，然后大家轮流走。每一步都可以用下面的操作顺序来描述：
> 如果数组的大小为 1，游戏结束。
> 当前下棋的棋手选择两个不同的索引 i、j(1≤i,j≤|a|)，并执行以下操作--从数组中移除 ai 和 aj，并在数组中添加一个等于⌊ai+aj2⌋⋅2 的数字。换句话说，首先将 ai 和 aj 的和除以 2(向下舍入)，然后将结果乘以 2。
> 玛莎的目标是最大化最终数字，而奥丽雅的目标是最小化最终数字。
> 玛莎和奥丽雅决定在初始数组 a 的每个非空前缀上进行博弈，并请求您的帮助。
> 对于每个 k(=1,2,...,n)，请回答下面的问题。让数组 a 的前 k 个元素出现在游戏中，索引分别为 1,2,...,k。在双方都下得最好的情况下，最后会剩下多少个元素？

## 解题思路

> 我们只需要注意到奇数加偶数会产生一个-1，那么我们就是要算怎么样计算这个值，我们发现，无论哪两个数字都会产生一个偶数，所以偶数是最后消去的，我们如果想要答案最大，那么一定是优先消除掉奇数，如果想要答案最小，一定是奇数和偶数组合，那么我们记录奇数和偶数的数量，在面对到奇数的时候，这个减去的多少个-1，我们可以算出他的过程，注意对于只有一个数字的情况要特判。

## 代码

```
#include <bits/stdc++.h>

#define int long long
#define endl '\n'
#define fix(n) std::fixed << std::setprecision(n)
[[maybe_unused]]typedef std::pair<int, int> pii;
[[maybe_unused]]const int INF = 1e18 + 50;

void solve() {
    int n;
    std::cin >> n;
    std::vector<int> a(n);
    for (int i = 0; i < n; i++) std::cin >> a[i];
    int S = 0, C = 0;
    for (int i = 0; i < n; i++) {
        S += a[i], C += a[i] & 1;
        if (i == 0)
            std::cout << a[i] << " \n"[i == n - 1];
        else
            std::cout << S - C / 3 - (C % 3 == 1) << " \n"[i == n - 1];
    }
}

signed main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr), std::cout.tie(nullptr);
    int Lazy_boy_ = 1;
    std::cin >> Lazy_boy_;
    while (Lazy_boy_--)
        solve();
    return 0;
}
```
