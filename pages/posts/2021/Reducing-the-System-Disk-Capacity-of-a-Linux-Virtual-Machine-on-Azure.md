---
title: 缩减Azure上Linux虚拟机系统盘容量
date: 2021-11-13 00:52:31
tags:
    - Azure
    - 磁盘分区管理
---

# 前言
---

在使用Azure的时候，Azure提供的镜像默认磁盘是不可选择大小的，创建linux(虽然我一般用的是Ubuntu)虚拟机默认磁盘是30G,创建Windows默认是127G(某些Server镜像提供 smalldisk 32G大小)。
```
Azure Docs https://docs.azure.cn/zh-cn/billing/billing-azure-core-services-billing-instructions Azure 基本核心服务计费说明
Q3: 托管磁盘与其他非磁盘存储计费模型的区别？

A: 非托管磁盘存储（块 Blob，页 Blob，文件，队列，表）费用按存储的数据大小 (GB) 按月收费。标准/高级托管磁盘存储的总成本取决于磁盘的大小和数量、事务数量以及出站数据传输量，无论使用的磁盘空间有多少，都将针对配置的磁盘收取相同的费率。
```
阐明说就是，默认linux还有2G磁盘没有被分配，也是要收费一样的价格的
# 开始动手
## 情景1 分配回原本应该分配的2G磁盘
### 先创建好机器，然后关机。
### 选择`设置`->`大小和性能`->`自定义磁盘大小(GB)`->填入`32`->`调整大小`
![yun-bg](https://public.inprtx.eu.org/blog/2021/2021-11-13-23-02-17.png)
### 登录上服务器 正常情况(gen2)下系统磁盘是`/dev/sda1` 文件

```bash
growpart /dev/sda 1 # 扩容分区
e2fsck -f /dev/sda1 # 检查分区
resize2fs /dev/sda1 # 扩容文件系统
```

暂时没经过测试。应该这三句话就完成了29G磁盘空间扩容成31G
## 情景2 缩减磁盘
正常情况下在`东亚`区域 P4(5.81刀) 缩小为 E1(0.3刀) 价格还是挺可观的。
这里需要用到创建快照，克隆一个一模一样的系统磁盘，在对这个新磁盘上做分区缩小，数据复制到一个新的小磁盘上。
至于为什么不直接缩小
![问就是不能缩](https://public.inprtx.eu.org/blog/2021/2021-11-13-23-38-56.png)
### 创建快照
![名字随便填什么好了](https://public.inprtx.eu.org/blog/2021/2021-11-13-23-47-48.png)
### 通过快照，创建磁盘
![真的,随便填什么就好了](https://public.inprtx.eu.org/blog/2021/2021-11-13-23-49-18.png)
### 在开机状态下的虚拟机上，挂载新创建的OS镜像磁盘，以及`创建并附加新磁盘`->储存类型`标准SSD`->大小(GiB)`4` 然后保存
![别选错了啊](https://public.inprtx.eu.org/blog/2021/2021-11-13-23-56-11.png)
### ~~在linux上敲一堆命令~~
在Azure上，应该出现了sd abcd
```bash
root@linux:~# ls /dev |grep sd
sda
sda1
sda14
sda15
sdb
sdb1
sdc
sdc1
sdc14
sdc15
sdd
```
再用`parted -l`命令确认一下 `源磁盘` `目标磁盘`
我这里是sdc是源磁盘，sdd是目标磁盘
因为快照的os磁盘分配的是32G容量，会出现提示你GPT分区没有分配完提示(fix它就行了)
```bash
root@linux:~# parted -l
Model: Msft Virtual Disk (scsi)
Disk /dev/sda: 32.2GB
Sector size (logical/physical): 512B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
14      1049kB  5243kB  4194kB                     bios_grub
15      5243kB  116MB   111MB   fat32              boot, esp
 1      116MB   32.2GB  32.1GB  ext4


Model: Msft Virtual Disk (scsi)
Disk /dev/sdb: 4295MB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Disk Flags:

Number  Start   End     Size    Type     File system  Flags
 1      1049kB  4294MB  4293MB  primary  ext4


Warning: Not all of the space available to /dev/sdc appears to be used, you can
fix the GPT to use all of the space (an extra 4192256 blocks) or continue with
the current setting?
Fix/Ignore? fix
Model: Msft Virtual Disk (scsi)
Disk /dev/sdc: 34.4GB
Sector size (logical/physical): 512B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
14      1049kB  5243kB  4194kB                     bios_grub
15      5243kB  116MB   111MB   fat32              boot, esp
 1      116MB   32.2GB  32.1GB  ext4


Error: /dev/sdd: unrecognised disk label
Model: Msft Virtual Disk (scsi)
Disk /dev/sdd: 4295MB
Sector size (logical/physical): 512B/4096B
Partition Table: unknown
Disk Flags:
```
貌似我在做测试的磁盘可能有点小问题，应该不影响
```bash
# 前要要求，检查使用 Linux ext2 档案系统的 partition 是否正常工作
root@linux:~# e2fsck -f /dev/sdc1
e2fsck 1.45.5 (07-Jan-2020)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
Free blocks count wrong (7227005, counted=7187092).
Fix<y>? yes
Free inodes count wrong (3801502, counted=3801416).
Fix<y>? yes

cloudimg-rootfs: ***** FILE SYSTEM WAS MODIFIED *****
cloudimg-rootfs: 69304/3870720 files (0.1% non-contiguous), 649063/7836155 blocks

# 先缩减文件系统容量3G，不进行文件系统缩减ext4分区会炸
root@linux:~# resize2fs /dev/sdc1 3G
resize2fs 1.45.5 (07-Jan-2020)
Resizing the filesystem on /dev/sdc1 to 786432 (4k) blocks.
The filesystem on /dev/sdc1 is now 786432 (4k) blocks long.

# 调整分区大小3.5G
root@linux:~# parted /dev/sdc
GNU Parted 3.3
Using /dev/sdc
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print
Model: Msft Virtual Disk (scsi)
Disk /dev/sdc: 34.4GB
Sector size (logical/physical): 512B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
14      1049kB  5243kB  4194kB                     bios_grub
15      5243kB  116MB   111MB   fat32              boot, esp
 1      116MB   32.2GB  32.1GB  ext4

(parted) resizepart 1 3.5G
Warning: Shrinking a partition can cause data loss, are you sure you want to continue?
Yes/No? yes
(parted) q
Information: You may need to update /etc/fstab.

# 复制分区表 别弄混了 目标磁盘 源磁盘
root@linux:~# sgdisk -R /dev/sdd /dev/sdc
Caution! Secondary header was placed beyond the disk's limits! Moving the
header, but other problems may occur!
The operation has completed successfully.

# 然后就是漫长的复制分区了
root@linux:~# dd if=/dev/sdc14 of=/dev/sdd14 bs=1M
4+0 records in
4+0 records out
4194304 bytes (4.2 MB, 4.0 MiB) copied, 0.235834 s, 17.8 MB/s
root@linux:~# dd if=/dev/sdc15 of=/dev/sdd15 bs=1M
106+0 records in
106+0 records out
111149056 bytes (111 MB, 106 MiB) copied, 2.71533 s, 40.9 MB/s
root@linux:~# dd if=/dev/sdc1 of=/dev/sdd1 bs=1M
3226+1 records in
3226+1 records out
3383608320 bytes (3.4 GB, 3.2 GiB) copied, 111.126 s, 30.4 MB/s

# 扩容分区
root@linux:/# growpart /dev/sdd 1
CHANGED: partition=1 start=227328 old: size=6608610 end=6835938 new: size=8161247 end=8388575

# 扩容文件系统
root@linux:/# resize2fs /dev/sdd1
resize2fs 1.45.5 (07-Jan-2020)
Filesystem at /dev/sdd1 is mounted on /a; on-line resizing required
old_desc_blocks = 1, new_desc_blocks = 1
The filesystem on /dev/sdd1 is now 1020155 (4k) blocks long.
```
命令总结
```bash
e2fsck -f /dev/sdc1
resize2fs /dev/sdc1 3G
parted /dev/sdc
 print
 resizepart 1 3.5G
sgdisk -R /dev/sdd /dev/sdc
dd if=/dev/sdc14 of=/dev/sdd14 bs=1M
dd if=/dev/sdc15 of=/dev/sdd15 bs=1M
dd if=/dev/sdc1 of=/dev/sdd1 bs=1M
growpart /dev/sdd 1
resize2fs /dev/sdd1
```
### 修改新的缩小磁盘配置
![磁盘资源ID](https://public.inprtx.eu.org/blog/2021/2021-11-14-00-40-03.png)
因为新生成的磁盘还不是OS磁盘需要用az终端操作一下，
先停止虚拟机，虚拟机上取消挂载数据磁盘
在Azure上的Powershell里进行操作(主要是懒)
```powershell
# 定义变量
$DiskID = "磁盘资源ID"
$VMName = "虚拟机名称"
$AzSubscription = "订阅名"
```
```powershell
# 指定订阅
Select-AzSubscription -Subscription $AzSubscription

# 获取虚拟机信息
$VM = Get-AzVm | ? Name -eq $VMName

# 获取磁盘信息
$Disk = Get-AzDisk | ? Id -eq $DiskID

# 修改磁盘操作系统类型
$Disk.OsType = "Linux"

# 修改磁盘 Hyper-V 代数（宿主机为V2时需要手动设置）
$Disk.HyperVGeneration = "V2"

# 更新磁盘设置
Update-AzDisk -ResourceGroupName $VM.ResourceGroupName -DiskName $Disk.Name -Disk $Disk

```
然后这样操作后，就可以在虚拟机设置里磁盘 交换OS磁盘，
删除旧的磁盘，整个缩小OS磁盘流程就完成了
![yun-bg](https://public.inprtx.eu.org/blog/2021/2021-11-14-00-47-09.png)
# 总结
有时候其实也用不到30G那么大的磁盘，缩小为标准SSD 4G有时候还是~挺有必要~的

# 参考资料/内容引用
* [Azure 基本核心服务计费说明](https://docs.azure.cn/zh-cn/billing/billing-azure-core-services-billing-instructions)
* [缩减Azure上Linux虚拟机系统盘容量](https://www.cnblogs.com/mayswind/p/15116918.html)
