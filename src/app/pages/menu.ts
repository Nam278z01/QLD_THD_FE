export default function (values: any) {
  return [
    {
      title: values['dashboard']['title'],
      children: [
        {
          title: values['dashboard']['analysis'],
          link: '/pages/dashboard/analysis',
        }
      ],
      link: '/pages/dashboard',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['management']['title'],
      children: [
        {
          title: values['management']['qlmh'],
          link: '/pages/management/qlmh',
        }
      ],
      link: '/pages/management',
      menuIcon: 'icon icon-modify',
    }
  ];
}
