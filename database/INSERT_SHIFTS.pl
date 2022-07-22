#! /usr/bin/perl

use strict;
use warnings;

use DateTime;
use DateTime::Format::Strptime;
use DBI;

my $stdin;
my $dt = DateTime->now(time_zone => "local");
my $contdays = 10;

print "開始日を入力（デフォルト：" . $dt->ymd('') . "）\n";
$stdin = <STDIN>;

if (!($stdin eq "\n")) {
	$dt = DateTime::Format::Strptime->new(pattern => '%Y%m%d')->parse_datetime($stdin);
}

if (defined $dt) {
	print "->" . $dt->ymd('') . "\n";
} else {
	print "日付のフォーマットが正しくありません。\n";
	exit;
}

print "日数を入力（デフォルト：" . $contdays . "）\n";
$stdin = <STDIN>;

if (!($stdin eq "\n")) {
	if ($stdin =~ /^([0-9]+)\n$/) {
		$contdays = $1;
	} else {
		print "日数のフォーマットが正しくありません。\n";
		exit;
	}
}

print "->" . $contdays . "\n";


my @employees = (58, 135, 1590, 1721, 1724, 1725, 1755, 1780, 1859, 1892, 1893, 1906, 1912, 1951, 1952, 1963);
my @starttimelist = (730, 800, 830, 900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400);
my @endtimelist = (1430, 1500, 1530, 1600, 1630, 1700, 1730, 1800, 1830, 1900, 1930, 2000, 2030, 2100);

my $dbh = DBI->connect(
	"DBI:mysql:database=shift_mgr;host=localhost;mysql_server_prepare=1",
	"xxxx",
	"xxxxxxxxxxxxxxxx",
	{AutoCommit => 1, PrintError => 0, RaiseError => 1}
);
my $sth = $dbh->prepare("INSERT INTO shifts (employee_number, date, start, end) VALUES (?, ?, ?, ?);");

for (my $i = 0; $i < $contdays; $i++) {

	for (my $cnt = (rand 5) + 1; $cnt > 0; $cnt--) {
		eval {
			$sth->execute(
				@employees[int(rand scalar @employees)],
				$dt->ymd(''),
				@starttimelist[int(rand scalar @starttimelist)],
				@endtimelist[int(rand scalar @endtimelist)]
			);
		}
	}

	$dt->add(days => 1);
}

print "登録が完了しました。\n";
